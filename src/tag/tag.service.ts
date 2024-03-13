import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}
  async findAll() {
    return await this.prisma.tag.findMany();
  }
}
