import { Body, Controller, Delete, Get, Param, Patch, Post, HttpCode, UseGuards, Request } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateLobbyDto } from './dto/updateLobby.dto';
import { CreateLobbyDto } from './dto/createLobby.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { GetLobbyDto } from './dto/getLobby.dto';

@ApiTags('lobbies')
@Controller('lobbies')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  /**
   * sent by the game admin after creating a game
   * @param createLobbyDto needed infos to create a lobby
   * @param req 
   * @returns 
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createLobby(@Body() createLobbyDto: CreateLobbyDto, @Request() req): Promise<{lobbyId: string}> {
    return await this.lobbyService.create(createLobbyDto, req.user.id);
  }


 /**
  * sent by all game participaints
      - to get the code
      - to update their guest list version when in the lobby

  * @param id the id of the lobby
  * @returns lobby/game
  */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOneLobby(@Param('id') id: string, @Request() req): Promise<GetLobbyDto> {
    return await this.lobbyService.getById(id, req.user.id);
  }

  /**
   * sent by the game admin when they kick out a guest from the lobby
   * @param id the id of the lobby
   * @param updateLobbyDto updated lobby (without the guest)
   * @returns updated lobby
   */
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Patch(':id')
  async kickOutLobbyGuests(@Param('id') id: string, @Body() updateLobbyDto: UpdateLobbyDto, @Request() req) {
    return await this.lobbyService.kickOutLobbyGuests(id, updateLobbyDto.guestUsernames, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('join/:code')
  async joinLobby(@Param('code') code: string, @Request() req): Promise<{lobbyId: string}> {
    return await this.lobbyService.join(req.user.id, code);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Patch('exit/:id')
  async exitLobby(@Param('id') id: string, @Request() req) {
    return await this.lobbyService.exit(req.user.id, id);
  }

  // demo only
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteLobby(@Param('id') id: string) {
    await this.lobbyService.deleteLobby(id);
  }

}
