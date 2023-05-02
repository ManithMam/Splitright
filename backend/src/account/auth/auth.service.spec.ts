import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { AccountsService } from "../service/accounts.service";
import { loginDto } from "../dto/loginDTO";

const mockAccountLoginData: loginDto = {
    username: 'Max',
    password: 'mock-password'
}

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ AuthService, {
                provide: AccountsService,
                useValue: {findAccount: jest.fn().mockResolvedValue(mockAccountLoginData)}
            }]
        })
        .compile();
        authService = module.get<AuthService>(AuthService)
    })

    it('should be defined', () => {
        expect(authService).toBeDefined();
    })

    describe('login', () => {       
        it('should return existing account', async () => {
            const existingAccount = authService.login(mockAccountLoginData)
            expect(existingAccount).toBeDefined()
        })
    })


})