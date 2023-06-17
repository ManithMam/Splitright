import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './game.schema';
import { AccountsModule } from 'src/account/account.module';
import { LobbyModule } from 'src/lobby/lobby.module';

@Module({
    imports: [    
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
        AccountsModule,
        LobbyModule
    ],
    controllers: [GameController],
    providers: [GameService],
    exports: [GameService]
})
export class GameModule {}
