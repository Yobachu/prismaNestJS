import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './tag/tag.module';
import { UserModule } from './tag/user/user.module';
import { AuthMiddleware } from './tag/user/middlewares/auth.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TagModule, UserModule],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
