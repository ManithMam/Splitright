import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Account, AccountSchema } from './account.schema';
import { AccountsController } from './controller/accounts.controller';
import { AccountsService } from './service/accounts.service';


@Module({
    imports: [MongooseModule.forFeature([{name: Account.name, schema: AccountSchema}])],
    controllers: [AccountsController],
    providers: [AccountsService]
})

export class AccountsModule {}