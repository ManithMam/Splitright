import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { loginDto } from "../dto/loginDTO";

const mockAccount = {
    id: 'mock-id',
    username: 'Max',
    password: 'mock-password'
}

const loginData: loginDto = {
    username: 'Max',
    password: 'mock-password'
}

describe('AuthController', () => {
    let authController: AuthController
    let authService: AuthService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [{
                provide: AuthService,
                useValue: {login: jest.fn().mockResolvedValue(mockAccount)}
            }]
        }).compile();

        authController = module.get<AuthController>(AuthController)
    })

    it('should be defined', () => {
        expect(authController).toBeDefined();
    })  

    describe('login', () => {
        it('should return existing account', () => {
            expect(authController.login(loginData)).resolves.toEqual({id: 'mock-id', username: 'Max', password: 'mock-password'})
        })
    })
})
