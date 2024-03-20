import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { JWTSecret } from '../config';

@Module({
  imports: [
    JwtModule.register({
      secret: JWTSecret,
    }),
  ],
  providers: [ArticleService, PrismaService, UserService],
  controllers: [ArticleController],
})
export class ArticleModule {}
