import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/createGame.dto';
import { UpdateGameDto } from './dto/updateGame.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('games')
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
        @Body() updateGameDto: UpdateGameDto) {

        return this.gameService.update(gameId, updateGameDto);
    }

    @Delete(':id')
    async deleteById(@Param('id') gameId: string) {
        return this.gameService.delete(gameId);
    }
}
