import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PackagingService {
  constructor(private readonly prisma: PrismaService) {}
  async addPackagingToArticle(currentUser, packagingCreateDto, slug) {
    const packaging = await this.prisma.article.findFirst({
      where: { slug: slug },
      include: { author: true, packaging: true },
    });

    let existingPackaging = packaging.packaging.find((packaging) => {
      return packaging.articleId === packaging.id;
    });

    if (existingPackaging) {
      if (packaging.authorId !== currentUser.id) {
        throw new HttpException('You are not an owner', HttpStatus.FORBIDDEN);
      }

      existingPackaging = await this.prisma.packaging.update({
        where: { id: existingPackaging.id },
        data: { ...existingPackaging },
      });

      return existingPackaging;
    } else {
      if (packaging.authorId !== currentUser.id) {
        throw new HttpException('You are not an owner', HttpStatus.FORBIDDEN);
      }

      const newPackaging = await this.prisma.packaging.create({
        data: { ...packagingCreateDto, articleId: packaging.id },
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

      return newPackaging;
    }
  }
}
