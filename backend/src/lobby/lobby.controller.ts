import { Body, Controller, Delete, Get, Param, Patch, Post, HttpCode, UseGuards } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { LobbyDto } from './dto/lobby.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@ApiTags('lobbies')
@Controller('lobbies')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createLobby(@Body() lobbyDto: LobbyDto): Promise<LobbyDto> {
    return await this.lobbyService.createLobby(lobbyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllLobbies(): Promise<LobbyDto[]> {
    return await this.lobbyService.findAllLobbies();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findeOneLobby(@Param('id') id: string): Promise<LobbyDto> {
    return await this.lobbyService.findOneLobby(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateLobbyGuests(@Param('id') id: string, @Body() lobbyDTO: LobbyDto): Promise<LobbyDto> {
    return await this.lobbyService.updateLobbyGuests(id, lobbyDTO.guests);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteLobby(@Param('id') id: string): Promise<void> {
    await this.lobbyService.deleteLobby(id);
  }
}
