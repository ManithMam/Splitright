import { Body, Controller, Delete, Get, Param, Patch, Post,  UseGuards} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/createGame.dto';
import { UpdateGameDto } from './dto/updateGame.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@ApiTags('games')
@Controller('games')
export class GameController {

    constructor(private gameService: GameService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createGameDto: CreateGameDto) {
        return this.gameService.create(createGameDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findById(@Param('id') gameId: string) {
        return this.gameService.findById(gameId);
    }

    @UseGuards(JwtAuthGuard)
    // the request is send from the game admin when starting a game
    // the game admin sends gameId and their current lobby.guests list 
    @Patch(':id')
    async updateById(
        @Param('id') gameId: string, 
        @Body() updateGameDto: UpdateGameDto) {

        return this.gameService.update(gameId, updateGameDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteById(@Param('id') gameId: string) {
        return this.gameService.delete(gameId);
    }
}
