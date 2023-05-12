import { Module } from '@nestjs/common';
import { AccountsModule } from '../account.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';


@Module({
    imports: [AccountsModule, PassportModule],
    providers: [AuthService, LocalStrategy],
    controllers: [AuthController]
})

export class AuthModule {}