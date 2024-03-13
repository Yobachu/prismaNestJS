import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JWTSecret } from '../../config';

@Module({
  imports: [
    JwtModule.register({
      secret: JWTSecret,
    }),
  ],
  providers: [UserService, PrismaService],
  controllers: [UserController],
})
export class UserModule {}
