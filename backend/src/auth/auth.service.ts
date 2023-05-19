import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountsService } from '../account/service/accounts.service';
import { AccountDto } from '../account/dto/accountDTO';
import { Account } from '../account/schema/account.schema';
import { JwtService } from '@nestjs/jwt';
import { HydratedDocument } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
        private accountsService: AccountsService,
        private jwtService: JwtService) {}

    async validateAccount(accountToFind: AccountDto): Promise<Account> {
        const account = await this.accountsService.getAccountByUsernameAndPassword(accountToFind)
        if(account?.password !== accountToFind.password){
            throw new UnauthorizedException()
        }       
       
        return account;        
    }

    async login(account: Account) {     
        const payload = { username: account.username, sub: account.password}
        return{
            access_token: this.jwtService.sign(payload)
        }
    }

    
}