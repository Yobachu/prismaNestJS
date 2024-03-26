import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './tag/tag.module';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './user/middlewares/auth.middleware';
import { ArticleModule } from './article/article.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [TagModule, UserModule, ArticleModule, ProfileModule],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
