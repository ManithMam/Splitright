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
    
    // TODO: change after Lobby and Account impl
    async create(createGameDto: CreateGameDto) {
        this.logger.log("Creating a recipe...");

        let game = {
            title: createGameDto.title,
            spliMethod: createGameDto.spliMethod,
            code: randomstring.generate(7),
            amount: createGameDto.amount,
            admin: null,    // TODO: change based on token info after Account impl
        }

        const newGame = new this.gameModel(game);
        const result = newGame.save();
        this.logger.log("Recipe \"" + newGame.title + "\" stored successfully");
        
        //create and return Lobby
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

    async update(gameId: string, guestAccounts: string[]) {

        // find game
        let existingGame = await this.gameModel.findById(gameId);
        if (!existingGame) {
            throw new NotFoundException(`Game #${gameId} not found`);
        }

        // add admin to the list of account
        let allAccounts: string[] = guestAccounts;
        allAccounts.push(existingGame.admin.toString())

        // get results
        const results: Result[] = this.getResults(existingGame.amount, existingGame.spliMethod, allAccounts)

        // update game
        let updatedGame: UpdateGameDto = {
            results: results
        }
        existingGame = await this.gameModel.findByIdAndUpdate(gameId, updatedGame, { new: true });

        return 'Results for game #' + gameId + ' have been updated';
    }

    async delete(gameId: string) {
        const existingGame = await this.gameModel.findByIdAndDelete(gameId);
        if (!existingGame) {
            throw new NotFoundException(`Game #${gameId} not found`);
        }
        return 'Game #' + gameId + ' was deleted';
    }

    private getResults(amount: number, splitMethod: string, allAccounts: string[]): Result[] {
        
        const numberOfResults = allAccounts.length; // + the game owner
        let amounts: number[] = []
        let results: Result[] = []

        // get amounts for the results
        switch(splitMethod) {
            case 'Communist':
                let equalAmount: number = Number((amount / numberOfResults).toFixed(2));  // split and round to 2 digits after the comma
                for(let i=1; i <= numberOfResults; i++) {
                    amounts.push(equalAmount)
                }
                break;
            case 'Lucky':
                // TODO: impl
                console.log('Lucky')
                break;
            case 'Random':
                // TODO: impl
                console.log('Random')
                break;
            default:
                throw new NotFoundException(`Split method not found`);
        }

        // randomize the order of amounts
        amounts = this.shuffleAmounts(amounts);

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
    private shuffleAmounts(array: number[]) {
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
