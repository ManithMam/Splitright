import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AccountDto } from '../src/account/dto/accountDTO';

describe('Accounts (e2e)', () => {
    let app: INestApplication;
    let mongod: MongoMemoryServer;    
    let mongoUri;   
    let jwtToken;
    let accountId;
    const account: AccountDto = {username: 'Anna332', password: 'password'}

    async function addAccount(){        
        const newAccount = await request(app.getHttpServer())
            .post('/accounts')
            .send({
                username: account.username,
                password: account.password                
            })
            .expect(201)

        const id = newAccount.body.id

        return id;
    }

    async function getJwtToken(){       
        const login = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
            username: account.username,
            password: account.password
        })
        .expect(201)

        const {token} = login.body;         
        
        return token;
    }    
    
    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: async() => {
                        mongod = await MongoMemoryServer.create();
                        mongoUri = await mongod.getUri();
                        return {
                            uri: mongoUri
                        }
                    }
                }),
                AppModule
            ]
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();

        accountId = await addAccount();    
        jwtToken = await getJwtToken();        
    })      

    it('POST /accounts should post a new account', () => {
        return request(app.getHttpServer())
            .post('/accounts')
            .send({
                username: 'MaxMustermann',
                password: 'password'                
            })
            .expect((response: request.Response) => {
                const {
                    username,
                    games,
                    avatar,
                    id            
                } = response.body               

                expect(201);
                expect(username).toBe('MaxMustermann');
                expect(games).toBeDefined();
                expect(avatar).toBeDefined();
                expect(id).toBeDefined();
            })
    })

   it('POST /accounts with invalid body should fail', () => {
        request(app.getHttpServer())
            .post('/accounts')
            .send({
                name: "Name"
            })
            .expect((response: request.Response) => {
                expect(400);
            });        
    })  

    it('GET /accounts/me should return unauthorized with no bearer token', () => {
        return request(app.getHttpServer())
        .get('/accounts/me')        
        .expect(401)       

    })

    it('GET /accounts/me should return the correct account', async () => {
        return request(app.getHttpServer())
            .get('/accounts/me')
            .set('Authorization', 'Bearer ' + jwtToken)
            .expect(200)
            .expect((response: request.Response) => {
                const { username, games, avatar } = response.body;

                expect(username).toBeDefined();
                expect(games).toBeDefined();
                expect(avatar).toBeDefined();
                expect(username).toBe(account.username);
            })    
    })

    it('PATCH /accounts/username/:id should change username', async () => {
        const newName = "newAnna";
        return request(app.getHttpServer())
            .patch(`/accounts/username/${accountId}`)
            .set('Authorization', 'Bearer ' + jwtToken)
            .send({newUsername: newName})
            .expect(200)
            .expect((response: request.Response) => {
                const {username} = response.body;
                
                expect(username).toBeDefined();
                expect(username).toEqual(newName);
            })
    }) 

    it('PATCH /accounts/username/:id with invalid body should fail', async () => {    
        return request(app.getHttpServer())
            .patch(`/accounts/username/${accountId}`)
            .set('Authorization', 'Bearer ' + jwtToken)
            .send({})
            .expect((response: request.Response) => {
                expect(400);
            });
    })

    it('PATCH /accounts/username/:id should return unauthorized with no bearer token', async () => {        
        return request(app.getHttpServer())
            .patch(`/accounts/username/${accountId}`)           
            .send({newUsername: "Anna1234"})
            .expect((response: request.Response) => {
                expect(401);
            });
    }) 

    it('PATCH /accounts/username/:id should return unauthorized with invalid bearer token', async () => {        
        return request(app.getHttpServer())
            .patch(`/accounts/username/${accountId}`)       
            .set('Authorization', 'Bearer ' + "invalidToken123")    
            .send({newUsername: "Anna1234"})
            .expect((response: request.Response) => {
                expect(401);
            });
    }) 

    it('PATCH /accounts/username/:id with already existing name should fail', async () => {        
        return request(app.getHttpServer())
            .patch(`/accounts/username/${accountId}`)
            .set('Authorization', 'Bearer ' + jwtToken)
            .send({newUsername: "MaxMustermann"})
            .expect((response: request.Response) => {
                expect(409);
            });
    }) 

    it('PATCH /accounts/password/:id should change password', async () => {
        const newPassword = "newPassword";

        const login = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
            username: "newAnna",
            password: account.password
        })
        .expect(201)

        const {token} = login.body;     

        return request(app.getHttpServer())
            .patch(`/accounts/password/${accountId}`)
            .set('Authorization', 'Bearer ' + token)
            .send({newPassword: newPassword})
            .expect(200)                     
    })

    it('PATCH /accounts/password/:id should return unauthorized on missing token', async () => {
        return request(app.getHttpServer())
            .patch(`/accounts/password/${accountId}`)            
            .send({newPassword: "aNewPassword"})
            .expect(401) 
    })

    it('PATCH /accounts/password/:id should return unauthorized on invalid token', async () => {
        return request(app.getHttpServer())
            .patch(`/accounts/password/${accountId}`)      
            .set('Authorization', 'Bearer ' + "invalidToken")      
            .send({newPassword: "aNewPassword"})
            .expect(401) 
    })

    it('DELETE /accounts/:id should delete accounts', async () => {

        const login = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
            username: "newAnna",
            password: "newPassword"
        })
        .expect(201)

        const {token} = login.body;  

        await request(app.getHttpServer())
            .delete(`/accounts/${accountId}`)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)

        return await request(app.getHttpServer())
        .post('/auth/login')
        .send({
            username: "newAnna",
            password: "newPassword"
        }).expect(404)
    })    

    it('DELETE /accounts/:id should return unauthorized on missing token', async () => {
        return await request(app.getHttpServer())
        .delete(`/accounts/${accountId}`)        
        .expect(401)
    })

    it('DELETE /accounts/:id should return unauthorized on invalid token', async () => {
        return await request(app.getHttpServer())
        .delete(`/accounts/${accountId}`)      
        .set('Authorization', 'Bearer ' + "invalidToken")  
        .expect(401)
    })

    afterAll(async () => {
        if (mongod) await mongod.stop();
        await mongoose.connection.close();
        await app.close();
    })


})