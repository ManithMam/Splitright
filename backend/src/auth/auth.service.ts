import { BadRequestException, HttpCode, Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountService } from 'src/account/accounts.service';
import { AccountDto } from '../account/dto/accountDTO';
import { Account } from '../account/account.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private accountsService: AccountService,
        private jwtService: JwtService) {}

    async validateAccount(accountToFind: AccountDto): Promise<Account> {
        const account = await this.accountsService.getAccountByUsernameAndPassword(accountToFind)
       
        const isSamePassword = await bcrypt.compare(accountToFind.password, account.password)

        if(!isSamePassword){
            throw new UnauthorizedException()
        }         
       
        return account;        
    }

    async login(accountDto: AccountDto) {     
        const account = await this.accountsService.getAccountByUsernameAndPassword(accountDto)
        const token = await this.getToken(account.username, account.id);

        return {
            token: token.access_token,
        }
    }

    async register(account: AccountDto) {
        const newAccount = await this.accountsService.insertOne(account);
        
        if (newAccount) {
            return HttpCode(201);
        }
        else {
            return new BadRequestException();
        }
    }

    private async getToken(username: string, accountId: string) {
        const payload = { username: username, sub: accountId}
        return{
            access_token: this.jwtService.sign(payload)
        }
    }

    async verifyJwt(jwt: string): Promise<any> {
        return this.jwtService.verifyAsync(jwt);
    }
    
}