import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateGameDto } from './dto/createGame.dto';
import { Game } from './game.schema';
import mongoose, { Model } from 'mongoose';
import { UpdateGameDto } from './dto/updateGame.dto';
import { Result } from './result/result.model';
import { GetGameWithResults } from './dto/getGameWithResults.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AccountService } from 'src/account/accounts.service';
import { GetGameShortDto } from './dto/getGameShort.dto';
import { shuffleArray } from '@utils/utils';
import { GetGameWithoutResults } from './dto/getGameWithoutResults.dto';

@Injectable()
export class GameService {

    @Inject(AccountService)
    private readonly accountService: AccountService;

    constructor(@InjectModel(Game.name) private gameModel: Model<Game>) {
    }

    private readonly logger = new Logger(GameService.name);
    
    async create(accountId: string, createGameDto: CreateGameDto) {
        this.logger.debug("Creating a game...");

        let game = {
            title: createGameDto.title,
            mode: createGameDto.mode,
            amount: createGameDto.amount,
            adminId: accountId,
        }
        const newGame = new this.gameModel(game);
        const resultGame = await newGame.save();
        this.logger.debug("Game stored")

        return {gameId: resultGame._id.toString()};
    }

    async getAll(accountId: string): Promise<GetGameShortDto[]> {
        const existingAccount = await this.accountService.getAccountById(accountId);

        if(!existingAccount.games) {
            return [];
        }

        let games: GetGameShortDto[] = [];
        for (let gameId of existingAccount.games) {
                const game = await this.findById(gameId.toString());

                const gameAdminAvatar = (await this.accountService.getAccountById(game.adminId.toString())).avatar;

                let amountPaid = -1;
                for (let result of game.results) {
                    if(result.accountId = accountId) {
                        amountPaid = result.amount;
                        break;
                    }
                }

                const gameInfos: GetGameShortDto = {
                    id: game._id.toString(),
                    adminAvatar: gameAdminAvatar,
                    title: game.title,
                    amountPaid: amountPaid
                }

                games.push(gameInfos);

        }

        return games;
    }

    async getOneWithoutResults(gameId: string): Promise<GetGameWithoutResults> {
        const game = await this.findById(gameId);

        let adminUsername = (await this.accountService.getAccountById(game.adminId.toString())).username;

        const returnGame = {
            title: game.title,
            mode: game.mode, 
            amount: game.amount, 
            adminUsername: adminUsername,
        }

        return returnGame;
    }

    async getOneWithResults(gameId: string, accountId: string): Promise<GetGameWithResults> {
        const existingGame = await this.findById(gameId);

        if (this.accountHasGameResult(accountId, existingGame)) {
            let adminUsername = (await this.accountService.getAccountById(existingGame.adminId.toString())).username;

            let returnResults = []
            for(let result of existingGame.results) {
                const account = await this.accountService.getAccountById(result.accountId);
                const returnResult = {
                    username: account.username,
                    avatar: account.avatar,
                    amount: result.amount
                }
                returnResults.push(returnResult); 
            }
            const returnGame = {
                title: existingGame.title,
                mode: existingGame.mode, 
                amount: existingGame.amount, 
                adminUsername: adminUsername,
                results: returnResults
            }

            return returnGame;
        }

        return null;
    }

    async updateResults(accountId: string, gameId: string, updateGameDto: UpdateGameDto) {

        // find game
        let existingGame = await this.findById(gameId);

        if (existingGame.adminId.toString() != accountId) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
        this.logger.debug("Game is found");

        // add admin to the list of account
        let allAccountIds = []
        for (let username of updateGameDto.guestAccountUsernames) {
            let account = await this.accountService.getAccountByUsername(username);
            allAccountIds.push(account._id.toString())
        }
        allAccountIds.push(accountId)
        
        // get results
        const results: Result[] = this.generateResults(existingGame.amount, existingGame.mode, allAccountIds)

        // update game
        let updatedGame = {
            results: results
        }
        existingGame = await this.gameModel.findByIdAndUpdate(gameId, updatedGame, { new: true });
        this.logger.debug("Game is updated");

        // update participaints accounts adding the game to heir games lists
        for (let accountId of allAccountIds) {
            await this.accountService.update(accountId, {gameId: gameId})
        }
        this.logger.debug("Game is added to participaints accounts");
    }

    private async deleteFromDb(gameId: string) {
        await this.gameModel.findByIdAndDelete(gameId).exec();
        return HttpStatus.NO_CONTENT;
    }

    async delete(accountId: string, gameId: string) {
        const existingGame = await this.findById(gameId);

        if(accountId != existingGame.adminId.toString()) {
            throw new HttpException(`You cannot delete this game`, HttpStatus.UNAUTHORIZED);
        }

        await this.deleteFromDb(gameId);
    }

    // public so it's accessible to populateDb.service.ts
    public generateResults(amount: number, splitMethod: string, allAccounts: string[]): Result[] {
        
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
                throw new HttpException('Wrong split method', HttpStatus.BAD_REQUEST);
        }

        // randomize the order of amounts
        amounts = shuffleArray(amounts);

        // assign amount to account
        for(let i=0; i < numberOfResults; i++) {
            let result: Result = {
                accountId: allAccounts.at(i),
                amount: amounts.at(i)
            }
            results.push(result)
        }
        
        return results;
    }

    private async findById(gameId: string) {
        const existingGame = await this.gameModel.findById(new mongoose.Types.ObjectId(gameId));

        if (!existingGame) {
            this.logger.debug('Game not found')
            throw new HttpException('Game not found be', HttpStatus.NOT_FOUND)
        }

        return existingGame;
    }

    private accountHasGameResult(requesterId: string, existingGame: Game) {
        if(!Array.isArray(existingGame.results) || !existingGame.results) {
            return false;
        }

        for(let result of existingGame.results) {
            if(result.accountId === requesterId) {
                return true;
            }
        }

        return false;
    }
}
