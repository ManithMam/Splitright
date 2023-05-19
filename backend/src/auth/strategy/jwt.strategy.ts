import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AccountsService } from '../../account/service/accounts.service';
import { returnAccountDtoNoPassword } from '../../account/dto/returnAccountDTONoPassword';
import { AccountDto } from '../../account/dto/accountDTO';
import mongoose from 'mongoose';

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
        const accountDto: AccountDto = {username: payload.username, password}
        const games: [mongoose.Types.ObjectId] = (await this.accountsService.getAccountByUsernameAndPassword(accountDto)).games        
        const avatar: string = (await this.accountsService.getAccountByUsernameAndPassword(accountDto)).avatar               
        return { username: payload.username, games: games, avatar: avatar }
    }

}
