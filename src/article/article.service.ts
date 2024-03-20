import { Injectable } from '@nestjs/common';
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
    const article = await this.prisma.article.create({
      data: createArticleDto,
      include: { author: true },
    });
    if (!article.tagList) {
      article.tagList = [];
    }
    article.slug = this.getSlug(createArticleDto.title);
    article.author = user;
    article.authorId = currentUser.id;
    delete article.authorId;
    return { article: article };
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
