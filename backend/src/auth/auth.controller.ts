import { Body, Controller, Post, UseGuards, Request, Get} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard'
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Body() account){
        return this.authService.login(account)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/account')
    getAccount(@Request() req) {
        return req.user
    }
}