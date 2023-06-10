import {Controller, Param, Delete, Patch, Request, Get, UseGuards} from '@nestjs/common'
import { AccountsService } from '../service/accounts.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('accounts')
export class AccountsController {
    constructor(private accountsService: AccountsService) {}      

   @UseGuards(JwtAuthGuard)
   @Delete(':id')   
   async deleteAccount(@Param('id') accountId: string){
      return this.accountsService.deleteAccount(accountId)
   }

   @UseGuards(JwtAuthGuard)
   @Patch(':id')
   async renameAccount(@Param('id') accountId: string, @Request() req){     
      return this.accountsService.updateAccountName(accountId, req.body.newName)
   }  

   @UseGuards(JwtAuthGuard)
    @Get()
    getAccount(@Request() req) {
        return req.user
    }
   
}