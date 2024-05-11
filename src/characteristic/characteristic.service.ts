import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CharacteristicService {
  constructor(private readonly prisma: PrismaService) {}

  async addCharToArticle(slug, characteristicDto) {
    const article = await this.prisma.article.findFirst({
      where: { slug: slug },
      include: { author: true, characteristics: true },
    });

    let existingCharacteristic = article.characteristics.find(
      (characteristic) => {
        return (
          characteristic.manufacturer === characteristicDto.manufacturer &&
          characteristic.color === characteristicDto.color &&
          characteristic.material === characteristicDto.material
        );
      },
    );

    if (existingCharacteristic) {
      existingCharacteristic = await this.prisma.materialCharacteristics.update(
        {
          where: { id: existingCharacteristic.id },
          data: { ...characteristicDto },
          include: { product: true },
        },
      );

      existingCharacteristic.manufacturer = article.author.username;

      return existingCharacteristic;
    } else {
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

      newCharacteristic.manufacturer = article.author.username;

      return newCharacteristic;
    }
  }
}
