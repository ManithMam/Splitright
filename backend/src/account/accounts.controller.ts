import {Controller, Request, Get, UseGuards, UseFilters} from '@nestjs/common'
import { AccountService } from './accounts.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/exceptions/http-exception.filter';

@ApiTags('accounts')
@Controller('accounts')
@UseFilters(new HttpExceptionFilter())
export class AccountController {
   constructor(private accountsService: AccountService) {}      

   @UseGuards(JwtAuthGuard)
   @Get('me')   
   async getAccount(@Request() req){
      return this.accountsService.getAccountById(req.user.id)
   }
   
}