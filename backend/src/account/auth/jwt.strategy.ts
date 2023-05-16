import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConfig } from './jwt.config';
import { AccountsService } from '../service/accounts.service';
import { returnAccountDtoNoPassword } from '../dto/returnAccountDTONoPassword';
import { AccountDto } from '../dto/accountDTO';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private accountsService: AccountsService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        })        
    }

    async validate(payload: any): Promise<returnAccountDtoNoPassword>{
       
        const password: string = payload.sub
        const username1: string = payload.username
        const test: AccountDto = {username: username1, password}
        const games1 = (await this.accountsService.getAccountByUsernameAndPassword(test)).games        
        const avatar1: string = (await this.accountsService.getAccountByUsernameAndPassword(test)).avatar       
        const account =  { username: username1, games: games1, avatar: avatar1 }
        return account
    }

}
