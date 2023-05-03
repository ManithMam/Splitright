import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountsService } from '../service/accounts.service';
import { AccountDto } from '../dto/accountDTO';
import { Account } from '../schema/account.schema';

@Injectable()
export class AuthService {
    constructor(private accountsService: AccountsService) {}

    async login(accountToFind: AccountDto): Promise<Account> {
        const account = await this.accountsService.getAccountByUsernameAndPassword(accountToFind)
        if(account?.password !== accountToFind.password){
            throw new UnauthorizedException()
        }        
        //TODO: return JWT Token instead of account
        return account;        
    }

}