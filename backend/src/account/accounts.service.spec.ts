import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { Account, AccountSchema } from "./account.schema";
import { AccountModule } from "./account.module";
import { AccountService } from "./accounts.service";
import { AccountDto } from "./dto/accountDTO";
import { ReturnAccountDto } from "./dto/returnAccountDTO";
import { UpdateAccountGamesDto } from "./dto/updateAccountGames.dto";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ConflictException, NotFoundException } from "@nestjs/common";

describe('AccountsService', () => {    

    let accountService: AccountService;    
    let mongod: MongoMemoryServer;

    const account1: AccountDto = {username: "jenny123", password: "password"};
    const account2: AccountDto = {username: "aron556", password: "passwor"};
    const account3: AccountDto = {username: "ben443", password: "password123"};
     
    beforeEach(async () => {
        const module = await Test.createTestingModule({         
            imports: [             
                MongooseModule.forRootAsync({
                    useFactory: async() => {
                        mongod = await MongoMemoryServer.create();
                        const mongoUri = mongod.getUri();
                        return {
                            uri: mongoUri
                        }
                    }
                }),
                MongooseModule.forFeature([{name: "Account", schema: AccountSchema}]),    
                AccountModule               
            ],
            providers: [{provide: getModelToken(Account.name), useValue: Account}, AccountService] 
        }).compile();       
  
        accountService = module.get<AccountService>(AccountService);    
  
        await accountService.insertOne(account1);     
        await accountService.insertOne(account3);    
  
    })
  
    it('should be defined', () => {     
        expect(accountService).toBeDefined();
    })  

    it('accountService.insertOne() should create a new account', async () => {

        const accountInsert = await accountService.insertOne(account2);   
        
        expect(accountInsert).toBeDefined;
        expect(accountInsert.username).toEqual(account2.username);     
        expect(accountInsert.id).toBeDefined;
        expect(accountInsert.games).toBeDefined;  
        expect(accountInsert.avatar).toBeDefined;
    })

    it('accountService.insertOne() should throw an error when creating a account with a name which already exists', async() => {
        await expect(accountService.insertOne({username: account1.username, password: "password123"})).rejects.toEqual(new ConflictException('Account with that username already exists. Use different username.'));
    })

    it('accountService.getAccountByUsername() should get account by username',  async () => {

        const account = await accountService.getAccountByUsername(account1);

        expect(account).toBeDefined;
        expect(account.username).toEqual(account1.username);
        expect(account.id).toBeDefined;
        expect(account.games).toBeDefined;
        expect(account.avatar).toBeDefined;
    })    
 
    it('accountService.getAccountById() should get account by id',  async () => {

        const accountByNameAndPassword: ReturnAccountDto = await accountService.getAccountByUsername(account1);

        const id: string = accountByNameAndPassword.id;

        const accountById = await accountService.getAccountById(id)

        expect(accountById).toBeDefined;
        expect(accountById.username).toEqual(accountByNameAndPassword.username);
        expect(accountById.avatar).toEqual(accountByNameAndPassword.avatar);
        
    }) 

    it('accountService.getAccountById() should throw bad request error on query injection', async () => {        

        const idBad: string = "{ $ne: null }";             
        
        expect(() => {accountService.getAccountById(idBad)}).toThrow;
    }) 

    it('accountService.updateGames() should add new game id to accounts game[] array', async () => {

        const accountByNameAndPassword: ReturnAccountDto = await accountService.getAccountByUsername(account1);

        const id: string = accountByNameAndPassword.id;

        const mockgameId: UpdateAccountGamesDto = {gameId: "123456"}

        await accountService.updateGames(id, mockgameId);        

        const updatedAccount: ReturnAccountDto = await accountService.getAccountByUsername(account1);
        

        expect(updatedAccount.games[0]).toBeDefined();
        expect(updatedAccount.games[0]).toEqual(mockgameId.gameId);

    })

    it('accountService.updateUsername() should change username', async () => {

        const accountByNameAndPassword: ReturnAccountDto = await accountService.getAccountByUsername(account1);

        const _id: string = accountByNameAndPassword.id;

        const _newName = "NewName";

        const accountNewPassword = await accountService.updateUsername({id: _id, newName: _newName});

        expect(accountNewPassword.username).toEqual(_newName)

    })

    it('accountService.updateUsername() should throw an error when changing username to an already existing username', async () => {

        const accountByNameAndPassword: ReturnAccountDto = await accountService.getAccountByUsername(account1);

        const _id: string = accountByNameAndPassword.id;

        const _newName = account2.username;

        expect(() => {accountService.updateUsername({id: _id, newName: _newName})}).toThrow;
    })

     it('accountService.updatePassword() should change password', async () => {

        const oldAccount: ReturnAccountDto = await accountService.getAccountByUsername(account1);       

        const _id: string = oldAccount.id;

        const accountChangedPassword = await accountService.updatePassword({id: _id,  newPassword: "new123"});       

        expect(accountChangedPassword.password).not.toEqual(oldAccount.password);

    }) 

    it('accountService.should delete account', async () => {

        const accountByNameAndPassword: ReturnAccountDto = await accountService.getAccountByUsername(account1);
        
        expect(accountByNameAndPassword).toBeDefined;

        await accountService.deleteById(accountByNameAndPassword.id);        
        
        expect(() => {accountService.getAccountByUsername(account1)}).toThrow;
    })

    it('accountService.getAccountByUsername() should throw an NotFoundException when username does not exist', async () => {

        const doesNotExist: AccountDto = {username: "DoesNotExist", password: "password123"};
        await expect(accountService.getAccountByUsername(doesNotExist)).rejects.toEqual(new NotFoundException('Account not found.')); 

    })

    it('accountService.getAccountById() should throw NotFoundException when id is wrong or does not exist', async() => {
        await expect(accountService.getAccountById("123")).rejects.toEqual(new NotFoundException("Account not found by id"));
    })    

    it('accountService.getAccountById() should throw NotFoundException when id is wrong or does not exist', async() => {
        await expect(accountService.getAccountById("123")).rejects.toEqual(new NotFoundException("Account not found by id"));
    })  

    it('accountService.updateGames() should throw NotFoundException when id is wrong or does not exist', async() => {
        const dto: UpdateAccountGamesDto = {gameId: "gameid"}
        await expect(accountService.updateGames("id123", dto)).rejects.toEqual(new NotFoundException("Account not found by id"));
    }) 

    it('accountService.updateUsername() should throw NotFoundException when id is wrong or does not exist', async() => {
        await expect(accountService.updateUsername({id: "does not exist", newName: "newUsername"})).rejects.toEqual(new NotFoundException("Account not found by id"));
    })

    it('accountService.updateUsername() should throw NotFoundException when username already exists', async() => {

        const account: ReturnAccountDto = await accountService.getAccountByUsername(account1);
        const _id: string = account.id;

        await expect(accountService.updateUsername({id: _id, newName: account3.username})).rejects.toEqual(new ConflictException("Account with that username already exists."));
    })

    it('accountService.updatePassword() should throw NotFoundException when id is wrong or does not exist', async() => {
        await expect(accountService.updatePassword({id: "does not exist", newPassword: "newPassword"})).rejects.toEqual(new NotFoundException("Account not found by id"));
    })

    it('accountService.deleteById() should throw NotFoundException when id is wrong or does not exist', async() => {
        await expect(accountService.deleteById("wrongId")).rejects.toEqual(new NotFoundException("Could not find account with that id."));
    })
  
    afterAll(async () => {    
        await mongod.stop();              
    })
  
  })