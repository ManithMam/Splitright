import { Test, TestingModule } from "@nestjs/testing";
import { AccountsService } from "../service/accounts.service";
import { getModelToken } from "@nestjs/mongoose";
import { Account, AccountDocument } from "../schema/account.schema";
import { Model } from "mongoose";

describe('AccountsService', () => {
    let service: AccountsService;
    let model: Model<AccountDocument> 

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ AccountsService, {
                provide: getModelToken(Account.name),
                useValue: { username: 'test', hashedPassword: 'password'}
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
            const newAccount = await service.insertOne({username: 'A User', password: 'password123'})
            expect(newAccount._id).toBeDefined()
        })        
    })
})
