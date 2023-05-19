import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017'), AccountsModule, AuthModule, GameModule, ConfigModule.forRoot({ isGlobal: true})],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
