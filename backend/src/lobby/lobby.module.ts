import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LobbyService } from './lobby.service';
import { Lobby, LobbySchema } from './lobby.schema';
import { AccountModule } from '../account/account.module';
import { GameModule } from '../game/game.module';
import { LobbyGateway } from './lobby.gateway';
import { jwtConfig } from '../auth/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lobby.name, schema: LobbySchema }]),
    AccountModule,
    GameModule,
    JwtModule.registerAsync(jwtConfig),
    AuthModule
  ],
  providers: [LobbyService, LobbyGateway],
})
export class LobbyModule{}