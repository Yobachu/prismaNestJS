import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from '../user/guards/auth.guard';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { Category } from '@prisma/client';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createCategory(@Body('category') createCategoryDto: CreateCategoryDto) {
    const category =
      await this.categoryService.createCategory(createCategoryDto);
    return { category };
  }

  @Put(':slug/add/:categoryId')
  @UseGuards(AuthGuard)
  async addArticleToCategory(
    @Param('slug') slug: string,
    @Param('categoryId') categoryId: string,
  ) {
    const category = await this.categoryService.addArticleToCategory(
      slug,
      categoryId,
    );
    return { category };
  }

  @Get()
  async findAll() {
    const category = await this.categoryService.findAll();
    return { category };
  }

  @Get(':slugCt')
  async findSingle(@Param('slugCt') slugCt: string) {
    const category = await this.categoryService.findSingle(slugCt)
    return { category }
  }
}
