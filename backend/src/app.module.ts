import { PopulateDbModule } from './populateDb/populateDb.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LobbyModule } from './lobby/lobby.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './file/file.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import configuration from '../config/configuration';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';

@Module({
  imports: [     
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory:async (configService:ConfigService) => ({
        uri: configService.get<string>('MONGO_URI_DOCKER')
      }),
    }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true
    }),
    AccountModule, 
    AuthModule, 
    GameModule,
    LobbyModule, 
    PopulateDbModule,
    HealthModule, 
    FileModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule { }
