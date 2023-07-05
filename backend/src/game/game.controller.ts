import { Body, Controller, Delete, Get, Param, Patch, Post,  UseGuards, Request, HttpCode, UseFilters} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/createGame.dto';
import { UpdateGameDto } from './dto/updateGame.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { GetGameWithResults } from './dto/getGameWithResults.dto';
import { GetGameShortDto } from './dto/getGameShort.dto';
import { GetGameWithoutResults } from './dto/getGameWithoutResults.dto';
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';

@ApiTags('games')
@Controller('games')
@UseFilters(new HttpExceptionFilter())
export class GameController {

    constructor(private gameService: GameService) {}

    /**
     * sent by game admin upon game creation
     * @param createGameDto game infos
     * @param req the whole request to get account id
     * @returns lobby infos for the created game
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createGameDto: CreateGameDto, @Request() req): Promise<{gameId: string}> {
        return this.gameService.create(req.user.id, createGameDto);
    }

    /**
     * sent by all lobby participants to get game infos
     * @param gameId 
     * @returns game infos
     */
    @Get('/lobby/:id')
    // no auth since everyone can enter the lobby
    async getGameWithoutResults(@Param('id') gameId: string): Promise<GetGameWithoutResults> {
        return this.gameService.getOneWithoutResults(gameId);
    }

    /**
     * sent by all participants to see results from a specific previous game
     * @param gameId 
     * @returns game infos
     */
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getGameWithResults(@Param('id') gameId: string, @Request() req): Promise<GetGameWithResults> {
        return this.gameService.getOneWithResults(gameId, req.user.id);
    }

    /**
     * sent by all participants to see all their results from previous games
     * @returns array with all game results
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Request() req): Promise<GetGameShortDto[]> {
        return this.gameService.getAll(req.user.id);
    }

    
    /**
     * sent by game admin when starting a game from the lobby
     * the game admin sends gameId and their current lobby.guests list 
     * the lobby for the game gets deleted and the game results get calculated
     * @param gameId 
     * @param updateGameDto 
     * @returns game with game results
     */
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateResults( 
        @Param('id') gameId: string, 
        @Request() req,
        @Body() updateGameDto: UpdateGameDto) {

        return this.gameService.updateResults(req.user.id, gameId, updateGameDto);
    }

    // demo only
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteById(@Param('id') gameId: string, @Request() req) {
        return this.gameService.delete(req.user.id, gameId);
    }
}
