import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CreateGameDto } from 'src/game/dto/createGame.dto';
import { AppModule } from './../src/app.module';
import { SplitMethod } from 'src/game/splitMethod.enum';

describe('GameController (e2e)', () => {
  let app: INestApplication;

  const gamesUrl = `http://localhost:3000/games/`;

  let existingGameId: string = "";

  const mockGame: CreateGameDto = {
    title: 'mock game', 
    splitMethod: SplitMethod.Communist, 
    amount: 100
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });


  // POST page

  describe("/games (POST)", () => {
    it("it should create a game and return game id and code", () => {
        return request(gamesUrl)
            .post("")
            .send(mockGame)
            .expect((response: request.Response) => {
                const {
                    gameId,
                    code
                } = response.body;

                expect(typeof gameId).not.toBeNull,
                expect(typeof gameId).toBe("string"),
                expect(typeof code).not.toBeNull,
                expect(typeof code).toBe("string")

                existingGameId = gameId;
            })
    })
  })

  // TODO: ask
  /*describe("/games/:id (GET)", () => {
    it("it should reaturn a game based on id", () => {
        return request(gamesUrl)
            .post(existingGameId)
            .send()
            .expect(200)
    })
  })*/

  describe("/games/:id (GET)", () => {
    it("it should reaturn a game based on id", () => {
        return request(gamesUrl)
            .post("644bd06b36d366d2bf5bead8")
            .send()
            .expect(404)
    })
  })

  
});