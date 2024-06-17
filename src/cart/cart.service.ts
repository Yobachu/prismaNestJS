import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { JwtPayload } from '../types/interfaces';
import { CartWithTotalPrice } from '../types/cartInterface';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateCartTotal(cartId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: { select: { price: true } },
          },
        },
      },
    });

    if (!cart) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }

    let totalPrice = 0;

    cart.items.forEach((cartItem) => {
      totalPrice += cartItem.quantity * cartItem.product.price;
    });

    return totalPrice;
  }

  async getUserCart(currentUser: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(currentUser.id),
      },
      select: {
        id: true,
        username: true,
        carts: {
          select: {
            userId: true,
            items: {
              select: {
                productId: true,
                quantity: true,
                product: {
                  select: {
                    id: true,
                    title: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return user;
  }
  async addProductToCart(articleId: number, currentUser: JwtPayload) {
    const cart = await this.prisma.cart.findFirst({
      where: {
        userId: currentUser.id,
      },
      include: { user: true },
    });

    if (!cart) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }

    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: articleId },
    });

    if (cartItem) {
      await this.prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity + 1 },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: articleId,
          quantity: 1,
        },
      });
    }

    const updatedCart: CartWithTotalPrice = await this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: { select: { id: true, title: true, price: true } },
          },
        },
      },
    });

    updatedCart.totalPrice = await this.calculateCartTotal(cart.id); // Присваиваем общую стоимость

    return updatedCart;
  }

  async increaseCartItemQuantity(articleId: number, currentUser: JwtPayload) {
    const cart = await this.prisma.cart.findFirst({
      where: {
        userId: currentUser.id,
      },
      include: { user: true },
    });

    if (!cart) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: Number(articleId) },
      include: { product: true }, // Включаем продукт для последующего вычисления стоимости
    });

    if (!cartItem) {
      throw new HttpException('Cart item not found', HttpStatus.NOT_FOUND);
    }
    const updatedCartItem = await this.prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity: cartItem.quantity + 1 },
      include: { product: { select: { id: true, title: true, price: true } } },
    });

    const updatedCart: CartWithTotalPrice = await this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: { select: { id: true, title: true, price: true } },
          },
        },
      },
    });

    // Вычисляем общую стоимость корзины
    updatedCart.totalPrice = await this.calculateCartTotal(updatedCart.id);

    return updatedCart as CartWithTotalPrice;
  }

  async decreaseCartItemQuantity(articleId: number, currentUser: JwtPayload) {
    const cart = await this.prisma.cart.findFirst({
      where: {
        userId: currentUser.id,
      },
      include: { user: true },
    });
    if (!cart) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }
    const article = await this.prisma.article.findUnique({
      where: { id: Number(articleId) },
    });
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    const cartItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: Number(articleId) },
    });

    if (cartItem.quantity > 1) {
      await this.prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: { decrement: 1 } },
      });
    } else {
      await this.prisma.cartItem.delete({
        where: { id: cartItem.id },
      });
    }

    const updatedCart: CartWithTotalPrice = await this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: { select: { id: true, title: true, price: true } },
          },
        },
      },
    });
    updatedCart.totalPrice = await this.calculateCartTotal(cart.id); // Assign total price

    return updatedCart as CartWithTotalPrice;
  }

  async removeProductFromCart(articleId: number, currentUser: JwtPayload) {
    const cart = await this.prisma.cart.findFirst({
      where: {
        userId: currentUser.id,
      },
      include: { user: true },
    });

    if (!cart) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }
    const cartItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: Number(articleId) },
    });

    if (!cartItem) {
      throw new HttpException(
        'Product not found in cart',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    const updatedCart: CartWithTotalPrice = await this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: { select: { id: true, title: true, price: true } },
          },
        },
      },
    });

    updatedCart.totalPrice = await this.calculateCartTotal(updatedCart.id);

    return updatedCart;
  }
}
