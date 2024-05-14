import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { User } from '../user/decorators/user.decorator';
import { JwtPayload } from '../types/interfaces';
import { PackingCreateDto } from './dto/packingCreate.dto';
import { PackagingService } from './packaging.service';
import { AuthGuard } from '../user/guards/auth.guard';

@Controller('packaging')
export class PackagingController {
  constructor(private readonly packagingService: PackagingService) {}

  @Patch(':slug/add')
  @UseGuards(AuthGuard)
  async addPackagingToArticle(
    @User() currentUser: JwtPayload,
    @Body('packaging') packagingCreateDto: PackingCreateDto,
    @Param('slug') slug: string,
  ) {
    const packaging = await this.packagingService.addPackagingToArticle(
      currentUser,
      packagingCreateDto,
      slug,
    );
    return { packaging };
  }
}
