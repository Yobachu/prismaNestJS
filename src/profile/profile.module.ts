import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, PrismaService],
  imports: [],
})
export class ProfileModule {}
