import { Body, Controller, Post, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountDto } from '../dto/accountDTO';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    login(@Body() accountDto: AccountDto){
        return this.authService.login(accountDto)
    }
}