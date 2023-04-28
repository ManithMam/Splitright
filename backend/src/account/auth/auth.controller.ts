import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from '../dto/loginDTO';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    login(@Body() loginDTO: loginDto){
        return this.authService.login(loginDTO)
    }
}