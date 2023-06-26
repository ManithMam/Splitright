import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LobbyController } from './lobby.controller';
import { LobbyService } from './lobby.service';
import { Lobby, LobbySchema } from './lobby.schema';
import { AccountModule } from 'src/account/account.module';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lobby.name, schema: LobbySchema }]),
    AccountModule,
    GameModule
  ],
  controllers: [LobbyController],
  providers: [LobbyService],
})
export class LobbyModule {}