import { Body, Controller, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../user/guards/auth.guard';
import { CharacteristicService } from './characteristic.service';
import { CharacteristicsDto } from './dto/characteristics.dto';
import { User } from '../user/decorators/user.decorator';
import { JwtPayload } from '../types/interfaces';

@Controller('characteristic')
export class CharacteristicController {
  constructor(private readonly characteristicService: CharacteristicService) {}
  @Patch(':slug/add')
  @UseGuards(AuthGuard)
  async characteristicsToArticle(
    @Body('characteristic') characteristicDto: CharacteristicsDto,
    @Param('slug') slug: string,
    @User() currentUser: JwtPayload,
  ) {
    const characteristic = await this.characteristicService.addCharToArticle(
      slug,
      characteristicDto,
      currentUser,
    );
    return { characteristic };
  }
}
