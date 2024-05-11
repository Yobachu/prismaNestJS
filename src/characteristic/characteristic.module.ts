import { Module } from '@nestjs/common';
import { CharacteristicController } from './characteristic.controller';
import { CharacteristicService } from './characteristic.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CharacteristicController],
  providers: [CharacteristicService, PrismaService],
})
export class CharacteristicModule {}
