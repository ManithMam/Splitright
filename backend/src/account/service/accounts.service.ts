import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from '../schema/account.schema';
import { CreateAccountDTO } from '../dto/createAccountDTO';

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
        const accountToDelete = await this.accountModel.findOneAndDelete({_id: accountId})
        if(!accountToDelete){
            throw new NotFoundException('Game with ' + accountId + ' could not be found.') 
        }
        return 'Account with id ' + accountId + ' was deleted.'
    }

    async updateAccountName(accountId: string, newName: string): Promise<Account>{        
        const name: string = newName
        const account = await this.accountModel.findOneAndUpdate({_id: accountId}, {username: name}, {new: true})

        return account
    }

    async updateAccountGamesAdd(gameId: string, accountId: string): Promise<Account>{           
        const account = await this.accountModel.findOneAndUpdate({_id: accountId}, 
            {$push: {games: gameId}}, {new: true})

        return account
    }

    async updateAccountGamesDelete(gameId: string, accountId: string): Promise<Account>{
        const account = await this.accountModel.findOneAndUpdate({_id: accountId}, 
            {$pull: {games: gameId}}, {new: true})
        
        return account
    }    
}