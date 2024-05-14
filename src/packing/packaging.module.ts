import { Module } from '@nestjs/common';
import { PackagingService } from './packaging.service';
import { PackagingController } from './packaging.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [PackagingService, PrismaService],
  controllers: [PackagingController]
})
export class PackagingModule {}
