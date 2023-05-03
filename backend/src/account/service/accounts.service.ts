import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from '../schema/account.schema';
import { AccountDto } from '../dto/accountDTO';
import { returnAccountDto } from '../dto/returnAccountDTO';

@Injectable()
export class AccountsService {
    constructor(@InjectModel(Account.name) private accountModel: Model<AccountDocument>) {}   

    async getAccountByUsernameAndPassword(accountToFind: AccountDto): Promise<returnAccountDto> {
        const account = await this.accountModel.findOne(accountToFind).exec()        
        return {      
            id: account.id,
            username: account.username,
            password: account.password,
            avatar: account.avatar
        }
    }    

    async getAccountById(accountId: string): Promise<returnAccountDto> {
        const account = await this.accountModel.findById(accountId).exec()
        return {
            id: account.id,
            username: account.username,
            password: account.password,
            avatar: account.avatar
        }
    }

    async insertOne(account: AccountDto): Promise<returnAccountDto>{        
        const newAccount = await this.accountModel.create(account)        
        return {
            id: newAccount.id,
            username: newAccount.username,
            password: newAccount.password,
            avatar: newAccount.avatar      
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