import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './account.schema';
import { AccountController } from './accounts.controller';
import { AccountService } from './accounts.service';

@Module({
    imports: [MongooseModule.forFeature([{name: Account.name, schema: AccountSchema}])],
    controllers: [AccountController],
    providers: [AccountService],
    exports: [AccountService]
})

export class AccountModule {}