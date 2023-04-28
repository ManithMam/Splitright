import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/createGame.dto';

@Controller('games')
export class GameController {

    constructor(private gameService: GameService) {}

    @Post()
    async create(@Body() createGameDto: CreateGameDto) {
        return this.gameService.create(createGameDto);
    }

    @Get(':id')
    async findById(@Param('id') gameId: string) {
        return this.gameService.findById(gameId);
    }

    // the request is send from the game admin when starting a game
    // the game admin sends gameId and their current lobby.guests list 
    @Patch(':id')
    async updateById(
        @Param('id') gameId: string, 
        @Body() body: {guestAccounts: string[]}) {

        return this.gameService.update(gameId, body.guestAccounts);
    }

    @Delete(':id')
    async deleteById(@Param('id') gameId: string) {
        return this.gameService.delete(gameId);
    }
}
