import { Inject, Injectable, Logger } from '@nestjs/common';
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
import { WsException } from '@nestjs/websockets';

@Injectable()
export class LobbyService {

  @Inject(AccountService)
  private readonly accountService: AccountService;

  @Inject(GameService)
  private readonly gameService: GameService;

  private readonly logger = new Logger(LobbyService.name);

  constructor(@InjectModel(Lobby.name) private readonly lobbyModel: Model<Lobby>) {}

  async create(createLobbyDto: CreateLobbyDto, adminId: string): Promise<{lobbyId: string}> {
    let code = await this.generateCode();

    let lobby: Lobby = {
      gameId: createLobbyDto.gameId,
      code: code,
      adminId: adminId
    }
    const newLobby = new this.lobbyModel(lobby);
    const result = await newLobby.save();

    Logger.debug("Lobby created");

    return {
      lobbyId: result._id.toString()    
    };
  }

  async getById(lobbyId: string): Promise<GetLobbyDto> {
    const existingLobby = await this.findLobbyByIdWithException(lobbyId)

    const guestAccounts = await this.getGuestAccounts(existingLobby.guestIds);

    const resultLobby: GetLobbyDto = {
      code: existingLobby.code,
      gameId: existingLobby.gameId,
      guestAccounts: guestAccounts
    }

    this.logger.debug("Lobby returned")

    return resultLobby;
  }

  async isAllowedToKickOutLobbyGuest(lobbyId: string, accountId: string) {
    const lobby = await this.findLobbyByIdWithException(lobbyId);

    if(!this.isLobbyAdmin(accountId, lobby)) {
      return false;
    }
    
    return true;
  }

  async join(accountId: string, code): Promise<{lobbyId: string}> {
    const lobby = await this.findLobbyByCode(code);

    // avoid a user joining multiple times
    if(lobby.adminId != accountId && (!lobby.guestIds || !lobby.guestIds.includes(accountId))) {
      let newGuestList = lobby.guestIds;
      newGuestList.push(accountId);
      await this.updateLobbyGuests(lobby._id.toString(), newGuestList);
    }

    this.logger.debug("Lobby joined");

    return {lobbyId: lobby._id.toString()};
  }

  async exit(requesterAccountId: string, lobbyId: string) {

    const existingLobby = await this.findLobbyByIdWithException(lobbyId);
    /*const existingLobby = await this.findLobbyById(lobbyId);

      if(!existingLobby) {
        return;
      }*/

      if(requesterAccountId === existingLobby.adminId) {
        await this.deleteLobby(lobbyId);
        // delete game too because it won't ever have results
        await this.gameService.delete(requesterAccountId, existingLobby.gameId);

        this.logger.debug("Admin exited lobby")

        return false;
      }
      else {
        let newGuestList = removeStringFromArray(existingLobby.guestIds, requesterAccountId);
        await this.updateLobbyGuests(lobbyId, newGuestList);

        this.logger.debug("Guest exited lobby")

        return true;
      }
  }

  async closeLobby(lobbyId: string, requesterAccountId: string) {
    const existingLobby = await this.findLobbyByIdWithException(lobbyId);

    if(requesterAccountId != existingLobby.adminId) {
      throw new WsException('Unauthorized');
    }

    await this.gameService.updateResults(requesterAccountId, existingLobby.gameId, {guestAccountIds: existingLobby.guestIds});
    
    await this.deleteLobby(lobbyId);

    this.logger.debug("Admin closed lobby")

    return existingLobby.gameId;
  }

  private async deleteLobby(lobbyId: string) {
    await this.lobbyModel.findByIdAndDelete(lobbyId).exec();
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
      return null;
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

  private isLobbyAdmin(requesterId: string, existingLobby: Lobby) {
    if(existingLobby.adminId === requesterId) {
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

  private async generateCode() {
    let code = randomstring.generate(7) as string;

    // code is not unique
    if(await this.findLobbyByCode(code) === null) {
      return code;
    }

    this.generateCode();
  }

  private async findLobbyByIdWithException(lobbyId: string) {
    const lobby = await this.findLobbyById(lobbyId);

    if(!lobby) {
      const errorText = "Lobby not found"
      this.logger.error(errorText)
      throw new WsException(errorText);
    }

    return lobby;
  }
}