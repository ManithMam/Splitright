import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './models/account.schema';
import { AccountsController } from './controllers/accounts.controller';
import { AccountsService } from './providers/accounts.service';


@Module({
    imports: [MongooseModule.forFeature([{name: Account.name, schema: AccountSchema}])],
    controllers: [AccountsController],
    providers: [AccountsService]
})

export class AccountsModule {}