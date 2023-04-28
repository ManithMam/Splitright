import {Controller, Get, Post, Patch, Req, Res, Body, Next, Param} from '@nestjs/common'
import { AccountsService } from '../service/accounts.service';
import { CreateAccountDTO } from '../dto/createAccountDTO';
import { updateAccountGameDto } from '../dto/updateAccountGameDTO';


@Controller('accounts')
export class AccountsController {
    constructor(private accountsService: AccountsService) {}   

   @Post()
   async createAccount(@Body() account: CreateAccountDTO){          
      return this.accountsService.insertOne(account)           
   }    

    @Patch('/addGame/:id')   
   async updateAccountAddGame(@Param('id') id: string, @Body() game: updateAccountGameDto){
      return this.accountsService.updateUserGamesAdd(game, id)
   } 

    @Patch('/deleteGame/:id')   
   async updateAccountDeleteGame(@Param('id') id: string, @Body() game: updateAccountGameDto){
      return this.accountsService.updateUserGamesDelete(game, id)
   } 
}