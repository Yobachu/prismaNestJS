import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CharacteristicService {
  constructor(private readonly prisma: PrismaService) {}

  async addCharToArticle(slug, characteristicDto, currentUser) {
    const article = await this.prisma.article.findFirst({
      where: { slug: slug },
      include: { author: true, characteristics: true },
    });

    let existingCharacteristic = article.characteristics.find(
      (characteristic) => {
        return characteristic.articleId === article.id;
      },
    );

    if (existingCharacteristic) {
      if (article.authorId !== currentUser.id) {
        throw new HttpException('You are not an owner', HttpStatus.FORBIDDEN);
      }

      existingCharacteristic = await this.prisma.materialCharacteristics.update(
        {
          where: { id: existingCharacteristic.id },
          data: { ...characteristicDto },
          include: { product: true },
        },
      );

      existingCharacteristic.manufacturer = currentUser.username;

      return existingCharacteristic;
    } else {
      if (article.authorId !== currentUser.id) {
        throw new HttpException('You are not an owner', HttpStatus.FORBIDDEN);
      }

      const newCharacteristic =
        await this.prisma.materialCharacteristics.create({
          data: { ...characteristicDto, articleId: article.id },
          include: {
            product: {
              select: {
                title: true,
                description: true,
                body: true,
                favoritesCount: true,
              },
            },
          },
        });

      newCharacteristic.manufacturer = currentUser.username;

      return newCharacteristic;
    }
  }
}
