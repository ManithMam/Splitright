import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/createGame.dto';
import { getModelToken } from '@nestjs/mongoose';

const randomstring = require('randomstring');

const mockGameModel = jest.fn(() => ({
  _id: 'mock-id',
  code: randomstring.generate(7),
  save: jest.fn(),
}));

describe('GameService', () => {
  let service: GameService;
  

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: getModelToken('Game'),
          useValue: mockGameModel,
        },
    ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create Game', () => {
    it('should create game', async() => {

      const gameTest: CreateGameDto = {
        title: 'game test', 
        spliMethod: 'Communist', 
        amount: 100
      }

      const gameResult: {
        gameId: string;
        code: string;
      } = await service.create(gameTest);

      // Assert
      expect(gameResult.gameId).not.toBeNull();
      expect(gameResult.code).toHaveLength(7);
    });
  });



});
