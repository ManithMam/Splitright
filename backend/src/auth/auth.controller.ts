import { Body, Controller, Post, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard'
import { AccountDto } from 'src/account/dto/accountDTO';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    /**
     * sent by every user to login into their account
     * @param account username and password
     * @returns account and access token
     */
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Body() account: AccountDto){
        return this.authService.login(account);
    }    

    //demo only
    @Post('/register')
    async createAccount(@Body() account: AccountDto){
      return this.authService.register(account);           
   }   
}