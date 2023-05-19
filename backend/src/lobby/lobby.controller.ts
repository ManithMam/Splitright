import { Body, Controller, Delete, Get, Param, Patch, Post, HttpCode } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { LobbyDto } from './dto/lobby.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('lobbies')
@Controller('lobbies')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Post()
  async createLobby(@Body() lobbyDto: LobbyDto): Promise<LobbyDto> {
    return await this.lobbyService.createLobby(lobbyDto);
  }

  @Get()
  async findAllLobbies(): Promise<LobbyDto[]> {
    return await this.lobbyService.findAllLobbies();
  }

  @Get(':id')
  async findeOneLobby(@Param('id') id: string): Promise<LobbyDto> {
    return await this.lobbyService.findOneLobby(id);
  }

  @Patch(':id')
  async updateLobbyGuests(@Param('id') id: string, @Body() lobbyDTO: LobbyDto): Promise<LobbyDto> {
    return await this.lobbyService.updateLobbyGuests(id, lobbyDTO.guests);
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteLobby(@Param('id') id: string): Promise<void> {
    await this.lobbyService.deleteLobby(id);
  }
}
