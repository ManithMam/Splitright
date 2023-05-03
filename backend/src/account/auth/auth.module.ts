import { Module } from '@nestjs/common';
import { AccountsModule } from '../account.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';


@Module({
    imports: [AccountsModule],
    providers: [AuthService],
    controllers: [AuthController]
})

export class AuthModule {}