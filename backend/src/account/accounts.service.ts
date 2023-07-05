import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from './account.schema';
import { AccountDto, AccountUsernameDto } from './dto/accountDTO';
import { ReturnAccountDto} from './dto/returnAccountDTO';
import { UpdateAccountGamesDto } from './dto/updateAccountGames.dto';
import { ReturnAccountDtoNoPassword} from './dto/returnAccountDTONoPassword';
import { UpdateAccountUsernameDto } from './dto/updateAccountUsername.dto';
import { UpdateAccountPasswordDto } from './dto/updateAccountPassword.dto';

@Injectable()
export class AccountService {
    constructor(@InjectModel(Account.name) private accountModel: Model<AccountDocument>) {}   

    private readonly logger = new Logger(AccountService.name);

    async getAccountByUsername(accountToFind: AccountUsernameDto): Promise<ReturnAccountDto> {
        try{           

            const account = await this.accountModel.findOne({username: accountToFind.username}).exec();

            if(account){
                this.logger.debug("Account found by username");
            }            

            return {      
                username: account.username,
                password: account.password,
                games: account.games,
                avatar: account.avatar,
                id: account.id              
            }
        }
        catch(err){       
            this.logger.error("Account not found");    
            throw new NotFoundException('Account not found.')
        }
    }    

    async getAccountById(accountId: string) {
        try{

            const existingAccount = await this.accountModel.findById(accountId)                  

            const returnAccount = {
                username: existingAccount.username, 
                games: existingAccount.games, 
                avatar: existingAccount.avatar,
                id: existingAccount.id
            }

            this.logger.debug("Account returned by id.")

            return returnAccount;
        }
        catch(err){
            this.logger.error("Invalid MongoID"); 
            throw new NotFoundException("Account not found by id");
        }
        
    }   

    async insertOne(account: AccountDto): Promise<ReturnAccountDtoNoPassword>{        
        try{
            const newAccount = await this.accountModel.create(account);

            this.logger.debug("New account created");

            return {            
                username: newAccount.username,                
                games: newAccount.games,
                avatar: newAccount.avatar,
                id: newAccount.id
            }   
        }
        catch(err){
            throw new ConflictException('Account with that username already exists. Use different username.')
        }       
    }

    async updateGames(accountId: string, updateAccountDto: UpdateAccountGamesDto): Promise<ReturnAccountDtoNoPassword>{
        try{
            const newAccount = await this.accountModel.findOneAndUpdate({_id: accountId}, 
                {$push: {games: updateAccountDto.gameId}}, {new: true});
    
            this.logger.debug("New game added to account.");
    
            return {            
                username: newAccount.username,                
                games: newAccount.games,
                avatar: newAccount.avatar,
                id: newAccount.id
            }   
        }     
        catch{
            this.logger.error("Invalid MongoID");            
            throw new NotFoundException("Account not found by id");  
        }        
    }   

    async updateUsername(updateDto: UpdateAccountUsernameDto): Promise<ReturnAccountDtoNoPassword>{       
        
        //Validate mongo id coming from params
        try{
            await this.accountModel.findById(updateDto.id);
            this.logger.debug("Valid Id")
            
        }
        catch(err){
            this.logger.error("Invalid MongoID");            
            throw new NotFoundException("Account not found by id");           
        }

        try{
            const newAccount = (await this.accountModel.findByIdAndUpdate(
                updateDto.id,
                { $set: { username: updateDto.newName } }, { new: true }))              
            
            this.logger.debug("Updated account username");
     
            return {            
                username: newAccount.username,                
                games: newAccount.games,
                avatar: newAccount.avatar,
                id: newAccount.id
            }   
        }
        catch(err){
            this.logger.error("Username duplication error");
            throw new ConflictException("Account with that username already exists.")
        }         
    }
    
    async updatePassword(updateDto: UpdateAccountPasswordDto): Promise<ReturnAccountDto>{      
        
        try{
            const newAccount = await (await this.accountModel.findOneAndUpdate(
                { _id: updateDto.id },
                { $set: { password: updateDto.newPassword } }, { new: true })).save();     
    
            this.logger.debug("Updated account password");
                       
            return {            
                username: newAccount.username,                
                games: newAccount.games,
                avatar: newAccount.avatar,
                id: newAccount.id,
                password: newAccount.password
            }   
        }
        catch{
            this.logger.error("Invalid MongoID");   
            throw new NotFoundException("Account not found by id");   
        }       
        
    }

    async deleteById(accountId: string){
        try{
            const accountToDelete = await this.accountModel.findByIdAndDelete(accountId);

            this.logger.debug("Account deleted");

            return(accountToDelete)
        }
        catch{
            this.logger.error("Invalid MongoID")
            throw new NotFoundException("Could not find account with that id.");
        }
        
    }
}