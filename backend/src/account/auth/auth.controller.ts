import { Body, Controller, Post, UseGuards, Request} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountDto } from '../dto/accountDTO';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Body() account){
        return this.authService.login(account)
    }
}