import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { GameModule } from '../game/game.module';
import { PopulateDbService } from '../populateDb/populateDb.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../game/game.schema';
import { Account, AccountSchema } from '../account/account.schema';
import { PopulateDbController } from './populateDb.controller';

@Module({
    imports: [AccountModule, GameModule,
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
        MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),],
    controllers: [PopulateDbController],
    providers: [PopulateDbService],
})
export class PopulateDbModule {}
