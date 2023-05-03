import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './schema/account.schema';
import { AccountsController } from './controller/accounts.controller';
import { AccountsService } from './service/accounts.service';

@Module({
    imports: [MongooseModule.forFeature([{name: Account.name, schema: AccountSchema}])],
    controllers: [AccountsController],
    providers: [AccountsService],
    exports: [AccountsService]
})

export class AccountsModule {}