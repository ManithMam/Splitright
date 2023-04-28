import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Account } from '../schema/account.schema';
import { CreateAccountDTO } from '../dto/createAccountDTO';
import { updateAccountGameDto } from '../dto/updateAccountGameDTO';

@Injectable()
export class AccountsService {
    constructor(@InjectModel(Account.name) private accountModel: Model<Account>) {}   

    async findAccount(username: string, password: string): Promise<Account>{
        const account = await this.accountModel.findOne({username: username, password: password}).exec()        
         return account
    }

    async insertOne(account: CreateAccountDTO): Promise<Account>{
        const newAccount = await this.accountModel.create(account)        
        return newAccount       
    }

    async updateUserGamesAdd(gameDto: updateAccountGameDto, id: string):  Promise<Account>{
        const gameOid = new Schema.Types.ObjectId(gameDto.game)
        const account = await this.accountModel.findById(id)
        account.games.push(gameOid)
        return account.save()
    }

    async updateUserGamesDelete(gameDto: updateAccountGameDto, id: string):  Promise<Account>{
        const gameOid = new Schema.Types.ObjectId(gameDto.game)
        const account = await this.accountModel.findById(id)
        const index = account.games.findIndex((_game) => _game === gameOid)
        account.games.splice(index, 1)
        return account.save()
    }    
}