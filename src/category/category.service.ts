import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { PrismaService } from '../prisma.service';
import slugify from 'slugify';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const slugCt = this.getSlug(createCategoryDto.name);
    const category = await this.prisma.category.create({
      data: { ...createCategoryDto, slugCt: slugCt },
      select: {
        id: true,
        name: true,
        description: true,
        products: true,
        slugCt: true,
      },
    });
    return category;
  }

  async addArticleToCategory(slug, categoryId) {
    const article = await this.prisma.article.findFirst({
      where: { slug: slug },
    });
    const category = await this.prisma.category.findUnique({
      where: { id: Number(categoryId) },
    });
    const result = await this.prisma.category.update({
      where: { id: Number(categoryId) },
      data: { products: { connect: { slug: slug } } },
      include: { products: true },
    });
    return result;
  }

  async findAll() {
    const category = await this.prisma.category.findMany();
    return category;
  }

  async findSingle(slugCt) {
    const category = await this.prisma.category.findMany({
      where: { slugCt: slugCt },
      select: { name: true, products: true },
    });
    return category;
  }

  private getSlug(name: string): string {
    return (
      slugify(name, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
