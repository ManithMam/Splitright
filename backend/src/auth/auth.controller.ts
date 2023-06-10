import { Body, Controller, Post, UseGuards, Request, Get} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard'
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AccountDto } from 'src/account/dto/accountDTO';
import { AccountsService } from 'src/account/service/accounts.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private accountsService: AccountsService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Body() account){
        return this.authService.login(account)
    }    

    @Post('/register')
    async createAccount(@Body() account: AccountDto){          
      return this.accountsService.insertOne(account)           
   }   
}