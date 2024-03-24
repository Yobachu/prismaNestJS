import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards, UsePipes, ValidationPipe,
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
}
