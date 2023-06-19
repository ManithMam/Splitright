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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './health/health.module';

@Module({
  imports: [    
    MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      uri: config.get<string>('MONGO_URI_DOCKER')
    })
  }), 
    AccountsModule, 
    AuthModule, 
    GameModule, 
    PopulateDbModule,
    ConfigModule.forRoot({ isGlobal: true }), LobbyModule, HealthModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
