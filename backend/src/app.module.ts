import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsModule } from './account/account.module';
import { AuthModule } from './account/auth/auth.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017'), AccountsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
