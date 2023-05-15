import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Account } from '../schema/account.schema';
import { AccountDto } from '../dto/accountDTO';



@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService) {
        super()
    }

    async validate(username: string, password: string): Promise<Account>{
        const accountDto: AccountDto = {username, password} 
        const account: Account = await this.authService.validateAccount(accountDto)
        if(!account) {
            throw new UnauthorizedException()
        }
        return account
    }
    
}