import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './tag/tag.module';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './user/middlewares/auth.middleware';
import { ArticleModule } from './article/article.module';
import { ProfileModule } from './profile/profile.module';
import { CategoryService } from './category/category.service';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from './category/category.module';
import { PrismaService } from './prisma.service';
import { CharacteristicController } from './characteristic/characteristic.controller';
import { CharacteristicModule } from './characteristic/characteristic.module';
import { CharacteristicService } from './characteristic/characteristic.service';
import { PackagingModule } from './packing/packaging.module';
import { PackagingService } from './packing/packaging.service';
import { CartModule } from './cart/cart.module';
import { CartService } from './cart/cart.service';

@Module({
  imports: [
    TagModule,
    UserModule,
    ArticleModule,
    ProfileModule,
    CategoryModule,
    CharacteristicModule,
    PackagingModule,
    CartModule,
  ],
  controllers: [AppController, CategoryController, CharacteristicController],
  providers: [
    AppService,
    JwtService,
    CategoryService,
    PrismaService,
    CharacteristicService,
    PackagingService,
    CartService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
