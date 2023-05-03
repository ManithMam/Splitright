import {Controller, Post, Body, Param, Delete, Patch, Request, Get} from '@nestjs/common'
import { AccountsService } from '../service/accounts.service';
import { AccountDto } from '../dto/accountDTO';


@Controller('accounts')
export class AccountsController {
    constructor(private accountsService: AccountsService) {}   

   @Post()
   async createAccount(@Body() account: AccountDto){          
      return this.accountsService.insertOne(account)           
   }    

   @Delete(':id')   
   async deleteAccount(@Param('id') accountId: string){
      return this.accountsService.deleteAccount(accountId)
   }

   @Patch(':id')
   async renameAccount(@Param('id') accountId: string, @Request() req){     
      return this.accountsService.updateAccountName(accountId, req.body.newName)
   }

   @Get(':id')
   async getAccountById(@Param('id') accountId: string){
      return this.accountsService.getAccountById(accountId)
   }  
   
}