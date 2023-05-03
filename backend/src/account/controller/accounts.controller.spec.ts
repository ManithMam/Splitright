import { Test, TestingModule } from "@nestjs/testing";
import { AccountsController } from "./accounts.controller";
import { AccountsService } from "../service/accounts.service";
import { AccountDto } from "../dto/accountDTO";

describe('AccountsController', () => {
    let controller: AccountsController;
    let service: AccountsService;         

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({            
            controllers: [AccountsController],
            providers: [{
                provide: AccountsService,
                useValue: {
                            insertOne: jest.fn().mockResolvedValue({_id: 'mock-id', username: 'Max', password: 'mock-password'})}
            }]
        }).compile();

        controller = module.get<AccountsController>(AccountsController)
        service = module.get<AccountsService>(AccountsService)
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    })    

    describe('createAccount', () => {        

        it('should create a new account', () => {
            const createAccountDto: AccountDto = {
                username: 'Max',
                password: 'mock-password'
            }    
            expect(controller.createAccount(createAccountDto)).resolves.toEqual({_id: 'mock-id', username: 'Max', password: 'mock-password'})
        })        
    })   

})

