import { Module } from '@nestjs/common';
import { AccountsModule } from '../account.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './jwt.config';


@Module({
    imports: [
        AccountsModule, 
        PassportModule,
        JwtModule.registerAsync(jwtConfig)
    ],
    providers: [AuthService, LocalStrategy],
    controllers: [AuthController]
})

export class AuthModule {}