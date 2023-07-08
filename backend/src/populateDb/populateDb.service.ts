import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from '../account/account.schema';
import { AccountService } from '../account/account.service';
import { Game } from '../game/game.schema';
import { GameService } from '../game/game.service';
import { shuffleArray } from '../utils/utils';

@Injectable()
export class PopulateDbService {

    @Inject(GameService)
    private readonly gameService: GameService;

    @Inject(AccountService)
    private readonly accoutService: AccountService;

    private readonly logger = new Logger(GameService.name);

    constructor(
        @InjectModel(Game.name) private gameModel: Model<Game>,
        @InjectModel(Account.name) private accountModel: Model<AccountDocument>) {
    }

    async populate() {

        const accountIds = await this.generateAccounts();
        this.generateGames(accountIds);
        
    }

    private async generateAccounts() {

        const names: string[] = ["jenny123", "sam99", "rose98", "peter1506", "debby777", "john00"];
        let accountIds: string[] = []

        for(let i=0; i <= 5; i++) {
            let account: Account = {
                username: names.at(i), 
                password: "password",
                avatar: "avatar" + (i+1) + ".png"
            }
            const newAccount = await this.accountModel.create(account);
            accountIds.push(newAccount._id.toString())
        }

        return accountIds;
    }

    private async generateGames(accountIds: string[]) {

        const titles: string[] = [
            "Drinks",
            "Museum",
            "Gift for Tom",
            "McDonald's",
            "Concert tickets",

            "Groceries",
            "Cinema tickets",
            "Snacks",
            "Club entry",
            "Coffee",

            "Restaurant",
            "Groceries",
            "Coffee",
            "Picnic",
            "Bar"
        ]

        const modes = ['Communist', 'Lucky', 'Random'];

        // create games
        let gameIds: string[] = [];
        for(let i=0; i < 15; i++) {

            const modeInt = Number((Math.random() * (2 - 0) + 0).toFixed(0));
            const mode = modes.at(modeInt);
            const amount = Number((Math.random() * (100 - 5) + 5).toFixed(2));
            const selectedPlayers = this.selectPlayers(accountIds);
            const results = await this.gameService.generateResults(amount, mode, selectedPlayers.allPlayers);

            let game = {
                title: titles.at(i),
                mode: mode,
                amount: amount,
                adminId: selectedPlayers.admin,
                results: results
            }

            const newGame = await this.gameModel.create(game);
            this.updateAccounts(selectedPlayers.allPlayers, newGame._id.toString())
            gameIds.push(newGame._id.toString())

            this.logger.debug("Game created: " + newGame)
        }
    }

    selectPlayers(accountIds: string[]): SelectedPlayers {
        accountIds = shuffleArray(accountIds);
        const numberOfPlayers = Number((Math.random() * (6 - 3) + 3).toFixed(0))
        const allPlayers: string[] = accountIds.slice(0, numberOfPlayers);        

        const result: SelectedPlayers = {
            admin: allPlayers.at(0),
            allPlayers: allPlayers
        }
        
        return result;
    }

    updateAccounts(accountIds: string[], gameId: string) {
        for(let accountId of accountIds) {
            this.accoutService.updateGames(accountId, {gameId: gameId})
        }
    }
}

interface SelectedPlayers {
    admin: string,
    allPlayers: string[]
}
