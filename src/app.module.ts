import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './tag/tag.module';
import { UserModule } from './tag/user/user.module';

@Module({
  imports: [TagModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
