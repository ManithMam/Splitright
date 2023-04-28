import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountsService } from '../service/accounts.service';
import { loginDto } from '../dto/loginDTO';
import { Account } from '../schema/account.schema';

@Injectable()
export class AuthService {
    constructor(private accountsService: AccountsService) {}

    async login(loginDto: loginDto): Promise<Account> {
        const account = await this.accountsService.findAccount(loginDto.username, loginDto.password)
        if(account?.password !== loginDto.password){
            throw new UnauthorizedException()
        }        
        //TODO: return JWT Token instead of account
        return account;        
    }

}