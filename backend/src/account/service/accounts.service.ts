import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Account } from '../schema/account.schema';
import { CreateAccountDTO } from '../dto/createAccountDTO';
import { updateAccountGameDto } from '../dto/updateAccountGameDTO';
import { loginDto } from '../dto/loginDTO';

@Injectable()
export class AccountsService {
    constructor(@InjectModel(Account.name) private accountModel: Model<Account>) {}   

    async findAccount(accountToFind: loginDto): Promise<Account>{
        const account = await this.accountModel.findOne(accountToFind).exec()        
         return account
    }

    async insertOne(account: CreateAccountDTO): Promise<Account>{        
        const newAccount = await this.accountModel.create(account)        
        return {
            username: newAccount.username,
            password: newAccount.password            
        }   
    }

    async deleteAccount(accountId: string) {
        const accountToDelete = await this.accountModel.findOneAndDelete()
        if(!accountToDelete){
            throw new NotFoundException('Game with ' + accountId + ' could not be found.') 
        }
        return 'Account with id ' + accountId + ' was deleted.'
    }

    async updateUserGamesAdd(gameDto: updateAccountGameDto, id: string):  Promise<Account>{
        const gameOid = new Schema.Types.ObjectId(gameDto.gameId)
        const account = await this.accountModel.findById(id)        
        account.games.push(gameOid)        
        return account.save()
    }

    async updateUserGamesDelete(gameDto: updateAccountGameDto, id: string):  Promise<Account>{
        const gameOid = new Schema.Types.ObjectId(gameDto.gameId)
        const account = await this.accountModel.findById(id)
        const index = account.games.findIndex((_game) => _game === gameOid)
        account.games.splice(index, 1)
        return account.save()
    }    
}