import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    GameModule,
    MongooseModule.forRoot('mongodb://localhost:8098/mydb'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
