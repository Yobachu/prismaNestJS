import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';
import { JWTSecret } from '../config';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: JWTSecret,
    }),
  ],
  providers: [UserService, PrismaService, AuthGuard],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
