import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LobbyModule } from './lobby/lobby.module';
import { AccountsModule } from './account/account.module';
import { AuthModule } from './account/auth/auth.module';
import { GameModule } from './game/game.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017'), AccountsModule, AuthModule, GameModule, LobbyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
