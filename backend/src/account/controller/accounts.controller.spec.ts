import { Test, TestingModule } from "@nestjs/testing";
import { AccountsController } from "./accounts.controller";
import { AccountsService } from "../service/accounts.service";

describe('AccountsController', () => {
    let controller: AccountsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({            
            controllers: [AccountsController],
            providers: [{
                provide: AccountsService,
                useValue: { username: 'test', hashedPassword: 'password'}
            }]
        }).compile();

        controller = module.get<AccountsController>(AccountsController)
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    })

    describe('/POST createAccount', () => {
        it('should return status code 200 ', async () => {
            const res = await fetch('http://localhost:3000/accounts')
            expect(res.status).toBe(200)
        })
    })

})
