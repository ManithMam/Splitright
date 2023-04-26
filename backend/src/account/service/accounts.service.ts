import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from '../schema/account.schema';
import { CreateAccountDTO } from '../validation/createAccountDTO';


@Injectable()
export class AccountsService {
    constructor(@InjectModel(Account.name) private readonly accountModel: Model<AccountDocument>) {}

    async getOne(_id: string){
        
    }

    async insertOne(account: CreateAccountDTO): Promise<Account>{
        return
    }
    
}