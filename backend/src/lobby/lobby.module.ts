import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LobbyController } from './lobby.controller';
import { LobbyService } from './lobby.service';
import { Lobby, LobbySchema } from './schemas/lobby.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lobby.name, schema: LobbySchema }]),
  ],
  controllers: [LobbyController],
  providers: [LobbyService],
})
export class LobbyModule {}