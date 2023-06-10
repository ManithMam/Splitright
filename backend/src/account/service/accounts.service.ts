import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from '../schema/account.schema';
import { AccountDto } from '../dto/accountDTO';
import { returnAccountDto } from '../dto/returnAccountDTO';
import { returnAccountDtoNoPassword } from '../dto/returnAccountDTONoPassword';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountsService {
    constructor(@InjectModel(Account.name) private accountModel: Model<AccountDocument>) {}   

    async getAccountByUsernameAndPassword(accountToFind: AccountDto): Promise<returnAccountDto> {
        try{           

            const account = await this.accountModel.findOne({username: accountToFind.username}).exec()

            return {      
                username: account.username,
                password: account.password,
                games: account.games,
                avatar: account.avatar,
                id: account.id              
            }
        }
        catch(err){
            throw new NotFoundException('Account not found. Wrong username or password.')
        }
    }    

    /* async getAccountById(accountId: string): Promise<returnAccountDtoNoPassword> {
        const account = await this.accountModel.findById(accountId).exec()
        return {            
            username: account.username,
            games: account.games,
            avatar: account.avatar
        }
    } */

    async insertOne(account: AccountDto): Promise<returnAccountDtoNoPassword>{        
        try{
            const newAccount = await this.accountModel.create(account)        
            return {            
                username: newAccount.username,                
                games: newAccount.games,
                avatar: newAccount.avatar,
                id: newAccount.id
            }   
        }
        catch(err){
            throw new ConflictException('Account with that password already exists. Use different password.')
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