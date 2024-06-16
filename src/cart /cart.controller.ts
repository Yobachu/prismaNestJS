import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from '@prisma/client';
import { AuthGuard } from '../user/guards/auth.guard';
import { JwtPayload } from '../types/interfaces';
import { User } from '../user/decorators/user.decorator';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUserCart(@User() currentUser: JwtPayload) {
    const cart = await this.cartService.getUserCart(currentUser);
    return cart;
  }

  @Post('add-product')
  @UseGuards(AuthGuard)
  async addProductToCart(
    @Body() body: { articleId: number },
    @User() currentUser: JwtPayload,
  ) {
    const { articleId } = body;
    const updatedCart = await this.cartService.addProductToCart(
      articleId,
      currentUser,
    );
    return updatedCart;
  }

  @Patch(':articleId/increase')
  @UseGuards(AuthGuard)
  async increaseCartItemQuantity(
    @Param('articleId') articleId: number,
    @User() currentUser: JwtPayload,
  ) {
    const updatedCart = await this.cartService.increaseCartItemQuantity(
      articleId,
      currentUser,
    );
    return updatedCart;
  }
  @Patch(':articleId/decrease')
  @UseGuards(AuthGuard)
  async decreaseCartItemQuantity(
    @Param('articleId') articleId: number,
    @User() currentUser: JwtPayload,
  ) {
    const updatedCart = await this.cartService.decreaseCartItemQuantity(
      articleId,
      currentUser,
    );
    return updatedCart;
  }
}
