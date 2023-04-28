import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/createGame.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from './game.schema';
import { Model } from 'mongoose';
import { UpdateGameDto } from './dto/updateGame.dto';
import * as randomstring from "randomstring";
import { Result } from './result/result.model';
import { GetGameDto } from './dto/getGame.dto';

@Injectable()
export class GameService {

    private readonly logger = new Logger(GameService.name);

    constructor(@InjectModel(Game.name) private gameModel: Model<Game>) {
    }
    
    async create(createGameDto: CreateGameDto) {
        this.logger.log("Creating a recipe...");

        let game = {
            title: createGameDto.title,
            spliMethod: createGameDto.spliMethod,
            code: randomstring.generate(7),     //TODO
            amount: createGameDto.amount,
            admin: null,    // TODO
        }

        const newGame = new this.gameModel(game);
        const result = newGame.save();
        this.logger.log("Recipe \"" + newGame.title + "\" stored successfully");
        
        //Create and return Lobby
        return {
            gameId: newGame._id.toString(),
            code: newGame.code
        };
    }

    async findById(gameId: string) {
        const existingGame = await this.gameModel.findById(gameId);
        if (!existingGame) {
            throw new NotFoundException(`Game #${gameId} not found`);
        }

        const gameDto: GetGameDto = {
            id: existingGame._id.toString(), 
            title: existingGame.title, 
            spliMethod: existingGame.spliMethod, 
            amount: existingGame.amount,
            admin: existingGame.admin.toString(),
            results: existingGame.results
        }

        return gameDto;
    }

    async delete(gameId: string) {
        const existingGame = await this.gameModel.findByIdAndDelete(gameId);
        if (!existingGame) {
            throw new NotFoundException(`Game #${gameId} not found`);
        }
        return existingGame;
    }

    async enter(gameId: string) {
        const existingGame = await this.gameModel.findByIdAndDelete(gameId);
        if (!existingGame) {
            throw new NotFoundException(`Game #${gameId} not found`);
        }
        return existingGame;
    }

    private splitAmount(amount: number, splitMethod: string, results: Result[]) {
        const amountOfUsers = results.length;

        switch(splitMethod) {
            case 'Communist':
                console.log("Communist")
                break;
            case 'Lucky':
                console.log('Lucky')
                break;
            case 'Random':
                console.log('Random')
                break;
            default:
                throw new NotFoundException(`Split method not found`);
        }

    }
}
