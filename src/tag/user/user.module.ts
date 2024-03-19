import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JWTSecret } from '../../config';
import { AuthGuard } from './guards/auth.guard';

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
