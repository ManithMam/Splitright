import {Controller, Request, Get, UseGuards, Post, Patch, Param, Delete, Body, UseFilters} from '@nestjs/common'
import { AccountService } from './accounts.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { AccountDto } from './dto/accountDTO';
import { UpdateAccountPasswordDto } from './dto/updateAccountPassword.dto';
import { UsernameDto } from './dto/updateAccountUsername.dto';
import { PasswordDto } from './dto/updateAccountPassword.dto';

import { HttpExceptionFilter } from '../exceptions/http-exception.filter';

@ApiTags('accounts')
@Controller('accounts')
@UseFilters(new HttpExceptionFilter())
export class AccountController {
   constructor(private accountsService: AccountService) {}      

   @UseGuards(JwtAuthGuard)
   @Get('me')   
   async getAccount(@Request() req){
      return this.accountsService.getAccountById(req.user.id);
   }    

   @Post()
   async createAccount(@Body() account: AccountDto){
      const newAccountInformation: AccountDto = {username: account.username, password: account.password};
      return this.accountsService.insertOne(newAccountInformation);
   }

   @UseGuards(JwtAuthGuard)
   @Patch('/username/:id')
   async changeUsername(@Param('id') accountId: string, @Body() usernameDto: UsernameDto){      
      return this.accountsService.updateUsername({id: accountId, newName: usernameDto.newUsername});
   }

   @UseGuards(JwtAuthGuard)
   @Patch('/password/:id')
   async changePassword(@Param('id') accountId: string, @Body() passwordDto: PasswordDto){
      const updatePassword: UpdateAccountPasswordDto = {id: accountId, newPassword: passwordDto.newPassword};
      return this.accountsService.updatePassword(updatePassword);
   }

   @UseGuards(JwtAuthGuard)
   @Delete(':id')
   async deleteAccount(@Param('id') accountId: string){
      return this.accountsService.deleteById(accountId);
   }


}