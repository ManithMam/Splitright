import { Body, Controller, Post} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountDto } from '../dto/accountDTO';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('accounts')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    login(@Body() accountDto: AccountDto){
        return this.authService.login(accountDto)
    }
}