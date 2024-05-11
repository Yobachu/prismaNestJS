import { Body, Controller, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../user/guards/auth.guard';
import { CharacteristicService } from './characteristic.service';
import { CharacteristicsDto } from './dto/characteristics.dto';

@Controller('characteristic')
export class CharacteristicController {
  constructor(private readonly characteristicService: CharacteristicService) {}
  @Patch(':slug/add')
  @UseGuards(AuthGuard)
  async characteristicsToArticle(
    @Body('characteristic') characteristicDto: CharacteristicsDto,
    @Param('slug') slug: string,
  ) {
    const characteristic = await this.characteristicService.addCharToArticle(
      slug,
      characteristicDto,
    );
    return { characteristic };
  }
}
