import {Controller, Get, Post, Patch, Req, Res, Body, Next, Param, Delete} from '@nestjs/common'
import { AccountsService } from '../service/accounts.service';
import { CreateAccountDTO } from '../dto/createAccountDTO';


@Controller('accounts')
export class AccountsController {
    constructor(private accountsService: AccountsService) {}   

   @Post()
   async createAccount(@Body() account: CreateAccountDTO){          
      return this.accountsService.insertOne(account)           
   }    

   @Delete(':id')   
   async deleteAccount(@Param('id') accountId: string){
      return this.accountsService.deleteAccount(accountId)
   }
}