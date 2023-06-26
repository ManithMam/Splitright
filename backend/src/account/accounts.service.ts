import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from './account.schema';
import { AccountDto } from './dto/accountDTO';
import { ReturnAccountDto} from './dto/returnAccountDTO';
import { UpdateAccountDto } from './dto/updateAccount.dto';
import { ReturnAccountDtoNoPassword} from './dto/returnAccountDTONoPassword';

@Injectable()
export class AccountService {
    constructor(@InjectModel(Account.name) private accountModel: Model<AccountDocument>) {}   

    async getAccountByUsernameAndPassword(accountToFind: AccountDto): Promise<ReturnAccountDto> {
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

    async getAccountById(accountId: string) {
        const existingAccount = await this.accountModel.findById(accountId);

        if(!existingAccount) {
            throw new NotFoundException("Account not found. Wrong id.")
        }

        const returnAccount = {
            username: existingAccount.username, 
            games: existingAccount.games, 
            avatar: existingAccount.avatar
        }

        return returnAccount;
    }

    async getAccountByUsername(username: string) {
        const existingAccount = await this.accountModel.findOne({username: username}).exec()

        if(!existingAccount) {
            throw new NotFoundException("Account not found. Wrong id.")
        }

        return existingAccount;
    }

    async insertOne(account: AccountDto): Promise<ReturnAccountDtoNoPassword>{        
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
            throw new ConflictException('Account with that username already exists. Use different username.')
        }       
    }

    async update(accountId: string, updateAccountDto: UpdateAccountDto): Promise<Account>{           
        const account = await this.accountModel.findOneAndUpdate({_id: accountId}, 
            {$push: {games: updateAccountDto.gameId}}, {new: true})

        return account
    }
}