import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AccountService } from 'src/account/accounts.service';
import { ReturnAccountDtoNoPassword } from '../../account/dto/returnAccountDTONoPassword';
import { AccountDto } from '../../account/dto/accountDTO';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private accountService: AccountService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        })        
    }

    async validate(payload: any): Promise<ReturnAccountDtoNoPassword>{                    
        const accountDto: AccountDto = {username: payload.username, password: payload.sub}
        const user: ReturnAccountDtoNoPassword = await this.accountService.getAccountByUsernameAndPassword(accountDto)

        return user;;
    }

}
