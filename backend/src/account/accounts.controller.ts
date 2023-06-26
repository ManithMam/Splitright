import {Controller, Request, Get, UseGuards} from '@nestjs/common'
import { AccountService } from './accounts.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('accounts')
@Controller('accounts')
export class AccountController {
   constructor(private accountsService: AccountService) {}      

   @UseGuards(JwtAuthGuard)
   @Get('me')   
   async getAccount(@Request() req){
      return this.accountsService.getAccountById(req.user.id)
   }
   
}