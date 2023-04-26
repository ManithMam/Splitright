import {Controller, Get, Post, Patch, Req, Res} from '@nestjs/common'
import { AccountsService } from '../service/accounts.service';


@Controller('accounts')
export class AccountsController {
    constructor(private accountsService: AccountsService) {}

   @Post()
   createAccount(@Req() req: Request, @Res() res: Response){
        
   }    

}