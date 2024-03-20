import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
}
