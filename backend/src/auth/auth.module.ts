import { Module } from '@nestjs/common';
import { AccountsModule } from '../account/account.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './jwt.config';
import { JwtStrategy } from './strategy/jwt.strategy';


@Module({
    imports: [
        AccountsModule, 
        PassportModule,
        JwtModule.registerAsync(jwtConfig)
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController]
})

export class AuthModule {}