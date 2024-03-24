import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';
import { PrismaService } from '../prisma.service';
import { JwtPayload } from '../types/interfaces';
import { UserService } from '../user/user.service';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}
  async createArticle(
    currentUser: JwtPayload,
    createArticleDto: CreateArticleDto,
  ) {
    const id = currentUser.id;
    const user = await this.userService.findOne(id);
    console.log(user);
    const slug = this.getSlug(createArticleDto.title);
    const authorId = currentUser.id;
    const article = await this.prisma.article.create({
      data: {
        ...createArticleDto,
        slug: slug,
        authorId: authorId,
      },
      include: { author: true },
    });
    if (!article.tagList) {
      article.tagList = [];
    }
    article.author = user;
    delete article.authorId;
    return { article: article };
  }

  async getSingleArticle(slug: string) {
    const article = await this.prisma.article.findFirst({
      where: { slug: slug },
      include: { author: true },
    });
    delete article.authorId;
    return article;
  }

  async deleteArticle(currentuser: JwtPayload, slug: string) {
    const article = await this.prisma.article.findFirst({
      where: { slug: slug },
      include: { author: true },
    });
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    if (article.authorId !== currentuser.id) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }
    const articleDel = await this.prisma.article.deleteMany({
      where: { slug: slug },
    });
    return articleDel;
  }

  async updateArticle(
    currentUser: JwtPayload,
    slug: string,
    updateArticleDto: CreateArticleDto,
  ) {
    const article = await this.prisma.article.update({
      where: { slug: slug },
      data: { ...updateArticleDto },
      include: { author: true },
    });

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    if (article.authorId !== currentUser.id) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }
    delete article.authorId;

    return article;
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
