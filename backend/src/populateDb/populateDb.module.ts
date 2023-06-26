import { Module } from '@nestjs/common';
import { AccountModule } from 'src/account/account.module';
import { GameModule } from 'src/game/game.module';
import { PopulateDbService } from 'src/populateDb/populateDb.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from 'src/game/game.schema';
import { Account, AccountSchema } from 'src/account/account.schema';
import { PopulateDbController } from './populateDb.controller';

@Module({
    imports: [AccountModule, GameModule,
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
        MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),],
    controllers: [PopulateDbController],
    providers: [PopulateDbService],
})
export class PopulateDbModule {}
