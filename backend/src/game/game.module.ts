import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './game.schema';
import { AccountModule } from '../account/account.module'
import { LobbyModule } from '../lobby/lobby.module';

@Module({
    imports: [    
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
        AccountModule,
    ],
    controllers: [GameController],
    providers: [GameService],
    exports: [GameService]
})
export class GameModule {}
