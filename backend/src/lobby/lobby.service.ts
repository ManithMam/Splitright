import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lobby } from './lobby.schema';
import * as randomstring from "randomstring";
import { removeStringFromArray } from '@utils/utils';
import { AccountService } from 'src/account/accounts.service';
import { GetLobbyDto } from './dto/getLobby.dto';
import { CreateLobbyDto } from './dto/createLobby.dto';
import { GuestAccount } from './dto/guestAccount';
import { GameService } from 'src/game/game.service';

@Injectable()
export class LobbyService {

  @Inject(AccountService)
  private readonly accountService: AccountService;

  @Inject(GameService)
  private readonly gameService: GameService;

  constructor(@InjectModel(Lobby.name) private readonly lobbyModel: Model<Lobby>) {}

  async create(createLobbyDto: CreateLobbyDto, adminId: string): Promise<{lobbyId: string}> {
    let lobby: Lobby = {
      gameId: createLobbyDto.gameId,
      code: randomstring.generate(7) as string,
      adminId: adminId
    }
    const newLobby = new this.lobbyModel(lobby);
    const result = await newLobby.save();

    return {
      lobbyId: result._id.toString()    
    };
  }

  async getById(lobbyId: string, requesterId: string): Promise<GetLobbyDto> {
    const existingLobby = await this.findLobbyById(lobbyId);

    // check if lobby exists
    if(!existingLobby) {
      throw new HttpException("Lobby not found", HttpStatus.NOT_FOUND);
    }

    // check if requester is part of the lobby
    if(!this.IsLobbyParticipaint(existingLobby, requesterId)) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const guestAccounts = await this.getGuestAccounts(existingLobby.guestIds);

    const resultLobby: GetLobbyDto = {
      code: existingLobby.code,
      gameId: existingLobby.gameId,
      guestAccounts: guestAccounts
    }

    return resultLobby;
  }

  async kickOutLobbyGuests(lobbyId: string, guestUsernames: string[], accountId: string) {
    const lobby = await this.findLobbyById(lobbyId);

    if(!this.isLobbyAdmin(accountId, lobby)) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    
    let guestIds = [];
    for( let guestUsername of guestUsernames) {
      const account = await this.accountService.getAccountByUsername(guestUsername)
      guestIds.push(account._id.toString());
    }

    await this.updateLobbyGuests(lobbyId, guestIds);
  }

  async join(accountId: string, code): Promise<{lobbyId: string}> {
    const lobby = await this.findLobbyByCode(code);

    let newGuestList = lobby.guestIds;
    newGuestList.push(accountId);

    await this.updateLobbyGuests(lobby._id.toString(), newGuestList);
    
    return {lobbyId: lobby._id.toString()};
  }

  async exit(requesterAccountId: string, lobbyId: string) {
    const existingLobby = await this.findLobbyById(lobbyId);

    if(requesterAccountId === existingLobby.adminId) {
      await this.deleteLobby(lobbyId);
      await this.gameService.delete(requesterAccountId, lobbyId);
    }
    else {
      let newGuestList = removeStringFromArray(existingLobby.guestIds, requesterAccountId);
      await this.updateLobbyGuests(lobbyId, newGuestList);
    }
  }

  async deleteLobby(id: string) {
    const existingLobby = await this.lobbyModel.findByIdAndDelete(id).exec();

    return HttpStatus.NO_CONTENT;
  }

  async findLobbyByGameId(gameId: string) {
    const existingLobby = await this.lobbyModel.findOne({gameId}).exec();

    if(!existingLobby) {
      return null
    }

    return existingLobby;
  }

  private async findLobbyByCode(code: string) {
    const existingLobby = await this.lobbyModel.findOne({code}).exec();

    if(!existingLobby) {
      return null
    }

    return existingLobby;
  }

  private async findLobbyById(id: string): Promise<Lobby> {
    const existingLobby = await this.lobbyModel.findById(id);

    if(!existingLobby) {
      throw new HttpException("Lobby not found", HttpStatus.NOT_FOUND);
    }

    let result = {
      gameId: existingLobby.gameId,
      adminId: existingLobby.adminId,
      code: existingLobby.code,
      guestIds: existingLobby.guestIds
    }

    return result;
  }

  private async updateLobbyGuests(id: string, guestIds: string[]): Promise<Lobby> {
    return await this.lobbyModel.findByIdAndUpdate(id, {guestIds: guestIds}, { new: true });
  }

  IsLobbyParticipaint(existingLobby: Lobby, requesterId: string) {
    if(this.isLobbyAdmin(requesterId, existingLobby) ||  this.isLobbyGuest(requesterId, existingLobby)) {
      return true;
    }

    return false;
  }

  isLobbyAdmin(requesterId: string, existingLobby: Lobby) {
    if(existingLobby.adminId === requesterId) {
      return true;
    }

    return false;
  }

  isLobbyGuest(requesterId: string, existingLobby: Lobby) {
    if(existingLobby.guestIds.includes(requesterId)) {
      return true;
    }

    return false;
  }

  private async getGuestAccounts(guestIds: string[]): Promise<GuestAccount[]> {

    let guestAccounts = [];
    for(let guestId of guestIds) {
      const tempAccount = await this.accountService.getAccountById(guestId);
      const guestAccount: GuestAccount = {
        username: tempAccount.username, 
        avatar: tempAccount.avatar
      }
      guestAccounts.push(guestAccount);
    }

    return guestAccounts;
  }
}