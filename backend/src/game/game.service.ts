import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateGameDto } from './dto/createGame.dto';
import { Game } from './game.schema';
import { Model } from 'mongoose';
import { UpdateGameDto } from './dto/updateGame.dto';
import { Result } from './result/result.model';
import { GetGameDetailsDto } from './dto/getGameDetails.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AccountService } from 'src/account/accounts.service';
import { LobbyService } from 'src/lobby/lobby.service';
import { CreateLobbyDto } from 'src/lobby/dto/createLobby.dto';
import { GetLobbyDto } from 'src/lobby/dto/getLobby.dto';
import { GetGameShortDto } from './dto/getGameShort.dto';
import { shuffleArray } from '@utils/utils';

var mongoose = require('mongoose');

@Injectable()
export class GameService {

    @Inject(AccountService)
    private readonly accountService: AccountService;

    @Inject(LobbyService)
    private readonly lobbyService: LobbyService;

    constructor(@InjectModel(Game.name) private gameModel: Model<Game>) {
    }

    private readonly logger = new Logger(GameService.name);
    
    async create(accountId: string, createGameDto: CreateGameDto): Promise<GetLobbyDto> {
        this.logger.debug("Creating a game...");

        let game = {
            title: createGameDto.title,
            splitMethod: createGameDto.splitMethod,
            amount: createGameDto.amount,
            admin: accountId,
        }
        const newGame = new this.gameModel(game);
        const resultGame = await newGame.save();
        this.logger.debug("Game stored")

        let createLobbyDto: CreateLobbyDto = {
            game: resultGame._id.toString(),
        }
        let lobby = await this.lobbyService.createLobby(createLobbyDto);
        this.logger.debug("Lobby created")

        let adminUsername = (await this.accountService.getAccountById(accountId)).username;

        this.logger.log("Game \"" + newGame.title + "\" created successfully");
        
        let resultLobby: GetLobbyDto = {
            lobbyId: lobby.id.toString(),
            gameTitle: resultGame.title, 
            code: lobby.code,
            gameMode: game.splitMethod,
            gameAmount: game.amount, 
            gameAdminUsername: adminUsername
        }

        return resultLobby;
    }

    async findAll(accountId: string): Promise<GetGameShortDto[]> {
        const existingAccount = await this.accountService.getAccountById(accountId);

        if(!existingAccount.games) {
            return [];
        }

        let games: GetGameShortDto[] = [];
        for (let gameId of existingAccount.games) {
            try {
                const game: GetGameDetailsDto = await this.findById(gameId.toString(), accountId);

                const gameAdminAvatar = (await this.accountService.getAccountById(game.admin)).avatar;

                let amountPaid = -1;
                for (let result of game.results) {
                    if(result.account = accountId) {
                        amountPaid = result.amount;
                        break;
                    }
                }

                const gameInfos: GetGameShortDto = {
                    id: game.id, 
                    adminAvatar: gameAdminAvatar,
                    title: game.title,
                    amountPaid: amountPaid
                }

                games.push(gameInfos);

            } catch (error) {
                this.logger.error(error)
            }
        }

        return games;
    }

    async findById(gameId: String, accountId: string): Promise<GetGameDetailsDto> {
        const existingGame = await this.gameModel.findById(new mongoose.Types.ObjectId(gameId));

        if (!existingGame) {
            throw new NotFoundException(`Game #${gameId} not found`);
        }

        let gameParticipaints = []
        for (let result of existingGame.results) {
            gameParticipaints.push(result.account);
        }
        if (!gameParticipaints.includes(accountId)) {
            throw new UnauthorizedException('Requester is not game participaint')
        }

        const gameDto: GetGameDetailsDto = {
            id: existingGame._id.toString(), 
            title: existingGame.title, 
            splitMethod: existingGame.splitMethod, 
            amount: existingGame.amount,
            admin: existingGame.admin.toString(),
            results: existingGame.results
        }

        return gameDto;
    }

    async updateResults(accountId: string, gameId: string, updateGameDto: UpdateGameDto): Promise<GetGameDetailsDto> {
        const LOBBY_ID = updateGameDto.lobbyId;
        const GAME_ID = gameId;

        // find lobby
        const existingLobby = await this.lobbyService.findLobbyById(LOBBY_ID);
        if (!existingLobby) {
            throw new NotFoundException(`Loby not found`);
        }

        if (gameId != existingLobby.gameId) {
            throw new BadRequestException("Given gameId doesn't match internal gameId")
        }

        // find game
        let existingGame = await this.gameModel.findById(GAME_ID);
        if (!existingGame) {
            throw new NotFoundException(`Game not found`);
        }
        if (existingGame.admin.toString() != accountId) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
        this.logger.debug("Game is found");

        this.lobbyService.deleteLobby(LOBBY_ID);
        this.logger.debug("Lobby is deleted");

        // add admin to the list of account
        let allAccountIds: string[] = updateGameDto.guestAccounts;
        allAccountIds.push(existingGame.admin.toString())
        
        // get results
        const results: Result[] = this.getResults(existingGame.amount, existingGame.splitMethod, allAccountIds)

        // update game
        let updatedGame = {
            results: results
        }
        existingGame = await this.gameModel.findByIdAndUpdate(GAME_ID, updatedGame, { new: true });
        this.logger.debug("Game is updated");

        // update participaints accounts adding the game to heir games lists
        for (let accountId of allAccountIds) {
            await this.accountService.update(accountId, {gameId: GAME_ID})
        }
        this.logger.debug("Game is added to participaints accounts");

        let returnGame: GetGameDetailsDto = {
            id: existingGame._id.toString(), 
            title: existingGame.title, 
            splitMethod: existingGame.splitMethod, 
            amount: existingGame.amount,
            admin: existingGame.admin.toString(), 
            results: existingGame.results
        }
        return returnGame;
    }

    // demo only
    async delete(accountId: string, gameId: string) {
        const existingGame = await this.gameModel.findById(gameId);
        if (!existingGame) {
            throw new NotFoundException(`Game not found`);
        }

        if(accountId === existingGame.admin.toString()) {
            await this.gameModel.findByIdAndDelete(gameId);
            return HttpStatus.NO_CONTENT;
        }
        else {
            throw new UnauthorizedException();
        }
    }

    // public so it's accessible to populateDb.service.ts
    public getResults(amount: number, splitMethod: string, allAccounts: string[]): Result[] {
        
        const numberOfResults = allAccounts.length; // + the game owner
        let amounts: number[] = []
        let results: Result[] = []

        // get amounts for the results
        switch(splitMethod) {
            case 'Communist':
                let equalAmount: number = Number((amount / numberOfResults).toFixed(2));  // split and round to 2 digits after the comma
                for(let i=1; i <= numberOfResults; i++) {
                    amounts.push(equalAmount);
                }
                break;
            case 'Lucky':
                amounts.push(amount);
                for(let i=1; i <= numberOfResults - 1; i++) {
                    amounts.push(0);
                }
                break;
            case 'Random':

                let min = 0;
                let max = amount;
                for(let i=1; i <= numberOfResults - 1; i++) {
                    let tempAmount = Number((Math.random() * (max - min) + min).toFixed(2));
                    amounts.push(tempAmount);
                    max -= tempAmount;
                }
                amounts.push(Number(max.toFixed(2)))

                break;
            default:
                throw new NotFoundException(`Split method not found`);
        }

        // randomize the order of amounts
        amounts = shuffleArray(amounts);

        // assign amount to account
        for(let i=0; i < numberOfResults; i++) {
            let result: Result = {
                account: allAccounts.at(i),
                amount: amounts.at(i)
            }
            results.push(result)
        }
        
        return results;
    }

    // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    public shuffleArray(array: any[]) {
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
      
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
    }
}
