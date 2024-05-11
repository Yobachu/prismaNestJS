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

  async getCurrentFeed(currentUser: JwtPayload, limit: number, offset: number) {
    const follows = await this.prisma.follow.findMany({
      where: {
        followerId: currentUser.id,
      },
      select: {
        followingId: true,
      },
    });

    if (follows.length === 0) {
      return { articles: [], articlesCount: 0 };
    }
    const followingUserIds = follows.map((follow) => follow.followingId);
    const articles = await this.prisma.article.findMany({
      where: {
        authorId: {
          in: followingUserIds,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            bio: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit || undefined,
      skip: offset || undefined,
    });
    const articlesCount = await this.prisma.article.count({
      where: {
        authorId: {
          in: followingUserIds,
        },
      },
    });

    return { articles, articlesCount };
  }
  async getSingleArticle(slug: string) {
    const article = await this.prisma.article.findFirst({
      where: { slug: slug },
      include: {
        author: true,
        categories: true,
        characteristics: true,
        packaging: true,
      },
    });
    delete article.authorId;
    delete article.author.password;
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
    delete article.author.password;

    return article;
  }

  async findAll(
    currentUser: JwtPayload,
    limit: number,
    offset: number,
    orderBy,
    author,
    tags,
  ) {
    const whereCondition: any = {};
    if (author) {
      whereCondition.author = { username: author };
    }
    if (tags && tags.length > 0) {
      whereCondition.tagList = {
        has: tags,
      };
    }
    const articles = await this.prisma.article.findMany({
      where: whereCondition,
      include: {
        author: true,
      },
      take: Number(limit) || undefined,
      skip: Number(offset) || undefined,
      orderBy: { createdAt: orderBy },
    });
    const articlesCount = await this.prisma.article.count();
    const articlesWithoutPasswords = articles.map((article) => ({
      ...article,
      author: {
        ...article.author,
        password: undefined,
      },
    }));
    return { articles: articlesWithoutPasswords, articlesCount };
  }

  async likeArticle(slug: string, currentUser: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: currentUser.id },
      select: { likedArticles: true, id: true },
    });
    const articles = await this.prisma.article.findUnique({
      where: { slug: slug },
      select: { likedBy: true, favoritesCount: true },
    });
    const userHasLiked = articles.likedBy.some(
      (likedUser) => likedUser.id === user.id,
    );
    if (userHasLiked) {
      throw new HttpException(
        'User has already liked this article.',
        HttpStatus.FORBIDDEN,
      );
    }

    const article = await this.prisma.article.update({
      where: { slug: slug },
      include: { author: true, likedBy: true },
      data: {
        likedBy: {
          connect: { id: user.id },
        },
        favoritesCount: articles.favoritesCount + 1,
      },
    });
    delete article.authorId;
    delete article.author.password;
    delete article.author.email;
    article.likedBy.forEach((user) => {
      delete user.password;
    });
    return { article: article };
  }

  async dislikeArticle(slug: string, currentUser: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: currentUser.id },
      select: { likedArticles: true, id: true },
    });
    const articles = await this.prisma.article.findUnique({
      where: { slug: slug },
      select: { likedBy: true, favoritesCount: true },
    });
    const userHasLiked = articles.likedBy.some(
      (likedUser) => likedUser.id === user.id,
    );
    if (!userHasLiked) {
      throw new HttpException(
        'User has not liked this article.',
        HttpStatus.FORBIDDEN,
      );
    }
    const article = await this.prisma.article.update({
      where: { slug: slug },
      include: { author: true },
      data: {
        likedBy: {
          disconnect: { id: user.id },
        },
        favoritesCount: articles.favoritesCount - 1,
      },
    });
    delete article.authorId;
    delete article.author.password;
    delete article.author.email;
    articles.likedBy.forEach((user) => {
      delete user.password;
    });
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
