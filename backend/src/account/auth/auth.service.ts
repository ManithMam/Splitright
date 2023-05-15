import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountsService } from '../service/accounts.service';
import { AccountDto } from '../dto/accountDTO';
import { Account } from '../schema/account.schema';
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

    async login(account: HydratedDocument<Account>) {
        const payload = { username: account.username, sub: account._id}
        return{
            access_token: this.jwtService.sign(payload)
        }
    }

    
}