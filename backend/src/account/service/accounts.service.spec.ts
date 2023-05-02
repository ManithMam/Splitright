import { Test, TestingModule } from "@nestjs/testing";
import { AccountsService } from "../service/accounts.service";
import { Schema, getModelToken } from "@nestjs/mongoose";
import { Account, AccountDocument } from "../schema/account.schema";
import mongoose, { Model, ObjectId } from "mongoose";
import { CreateAccountDTO } from "../dto/createAccountDTO";


const accountMockModel = {     
    username: 'Max',
    password: 'password123',
    games: []
}

const mockCreateAccountDTO: CreateAccountDTO = {
    username: 'Max',
    password: 'savePassword333'
}


describe('AccountsService', () => {
    let service: AccountsService;
    let model: Model<AccountDocument>    
    

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ AccountsService, {
                provide: getModelToken('Account'),
                useValue: { Account, 
                    create: jest.fn().mockResolvedValue(mockCreateAccountDTO), 
                    findById: jest.fn().mockResolvedValue(accountMockModel),
                    save: jest.fn()}
            }]
        }).compile();

        service = module.get<AccountsService>(AccountsService)
        model = module.get<Model<AccountDocument>>(getModelToken(Account.name)) 
    })

    it('should be defined', () => {
        expect(service).toBeDefined();
    })

     describe('insertOne', () => {
        it('should create new account', async () => {            

            const newAccountResult: { 
                username: string
                password: string
            } = await service.insertOne(mockCreateAccountDTO)
            
            expect(newAccountResult).toBeDefined()
            expect(newAccountResult.username).toBe('Max')   
            expect(newAccountResult.password).toBe('savePassword333')   
        })                  
    })    
})
