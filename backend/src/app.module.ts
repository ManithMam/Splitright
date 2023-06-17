import { PopulateDbModule } from './populateDb/populateDb.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LobbyModule } from './lobby/lobby.module';
import { AccountsModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './file/file.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PopulateDbModule, 
    MongooseModule.forRoot('mongodb://127.0.0.1:27017'), 
    AccountsModule, 
    AuthModule, 
    GameModule, 
    PopulateDbModule,
    ConfigModule.forRoot({ isGlobal: true }), LobbyModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
