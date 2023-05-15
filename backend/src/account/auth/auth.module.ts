import { Module } from '@nestjs/common';
import { AccountsModule } from '../account.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';


@Module({
    imports: [AccountsModule, PassportModule],
    providers: [AuthService, LocalStrategy, JwtService],
    controllers: [AuthController]
})

export class AuthModule {}