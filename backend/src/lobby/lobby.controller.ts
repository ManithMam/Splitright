import { Body, Controller, Delete, Get, Param, Patch, Post, HttpCode, UseGuards } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateLobbyDto } from './dto/updateLobby.dto';
import { CreateLobbyDto } from './dto/createLobby.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@ApiTags('lobbies')
@Controller('lobbies')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  // demo only
  @UseGuards(JwtAuthGuard)
  @Post()
  async createLobby(@Body() lobbyDto: CreateLobbyDto) {
    return await this.lobbyService.createLobby(lobbyDto);
  }


 /**
  * sent by all game participaints
      - game admin sends:
        - when already in the lobby to update their guest list version
      - game guests send:
        - to enter the game lobby
        - to update their guest list version when in the lobby
        - to get game results after the game results are initiated by the admin

  * @param id the id of the lobby
  * @returns lobby/game
  */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findeOneLobby(@Param('id') id: string) {
    return await this.lobbyService.findLobbyById(id);
  }

  /**
   * sent by the game admin when they kick out a guest from the lobby
   * @param id the id of the lobby
   * @param updateLobbyDto updated lobby (without the guest)
   * @returns updated lobby
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateLobbyGuests(@Param('id') id: string, @Body() updateLobbyDto: UpdateLobbyDto) {
    return await this.lobbyService.updateLobbyGuests(id, updateLobbyDto);
  }

  // demo only
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteLobby(@Param('id') id: string) {
    await this.lobbyService.deleteLobby(id);
  }

}
