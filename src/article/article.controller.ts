import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '../user/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { JwtPayload } from '../types/interfaces';
import { CreateArticleDto } from './dto/createArticle.dto';

@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService) {}
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @User() currentUser: JwtPayload,
    @Body('article') createArticleDto: CreateArticleDto,
  ) {
    return this.articleService.createArticle(currentUser, createArticleDto);
  }
  @Get('feed')
  @UseGuards(AuthGuard)
  async getCurrentFeed(
    @User() currentUser: JwtPayload,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return await this.articleService.getCurrentFeed(currentUser, limit, offset);
  }
  @Get(':slug')
  async getSingleArticle(@Param('slug') slug: string) {
    const article = await this.articleService.getSingleArticle(slug);
    return { article: article };
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @User() currentUser: JwtPayload,
    @Param('slug') slug: string,
  ) {
    return await this.articleService.deleteArticle(currentUser, slug);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateArticle(
    @User() currentUser: JwtPayload,
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: CreateArticleDto,
  ) {
    const article = await this.articleService.updateArticle(
      currentUser,
      slug,
      updateArticleDto,
    );
    return { article: article };
  }

  @Get()
  async findAll(
    @User() currentUser: JwtPayload,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('orderBy') orderBy?: 'desc' | 'asc',
    @Query('author') author?: string,
    @Query('tags') tags?: string[],
  ) {
    return this.articleService.findAll(
      currentUser,
      limit,
      offset,
      orderBy,
      author,
      tags,
    );
  }

  @Post(':slug/favorited')
  @UseGuards(AuthGuard)
  async likeArticle(
    @Param('slug') slug: string,
    @User() currentUser: JwtPayload,
  ) {
    return this.articleService.likeArticle(slug, currentUser);
  }

  @Delete(':slug/favorited')
  @UseGuards(AuthGuard)
  async dislikeArticle(
    @Param('slug') slug: string,
    @User() currentUser: JwtPayload,
  ) {
    return this.articleService.dislikeArticle(slug, currentUser);
  }

}
