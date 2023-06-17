import { HttpCode, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lobby } from './lobby.schema';
import { CreateLobbyDto } from './dto/createLobby.dto';
import * as randomstring from "randomstring";
import { UpdateLobbyDto } from './dto/updateLobby.dto';


@Injectable()
export class LobbyService {
  constructor(@InjectModel(Lobby.name) private readonly lobbyModel: Model<Lobby>) {}

  async createLobby(lobbyDto: CreateLobbyDto) {
    let lobby = {
      game: lobbyDto.game,
      code: randomstring.generate(7) as string
    }
    const newLobby = new this.lobbyModel(lobby);
    const result = await newLobby.save();

    return {
      id: result._id,
      game: lobbyDto.game,
      code: lobby.code
    };
  }

  async findLobbyById(lobbyId) {
    const existingLobby = await this.lobbyModel.findById(lobbyId);

    if(!existingLobby) {
      throw new NotFoundException("Lobby not found");
    }

    let result = {
      id: existingLobby._id,
      gameId: existingLobby.gameId,
      code: existingLobby.code,
      guests: existingLobby.guests
    }

    return result;
  }

  async updateLobbyGuests(id: string, updateLobbyDto: UpdateLobbyDto): Promise<Lobby> {
    return await this.lobbyModel.findByIdAndUpdate(id, updateLobbyDto, { new: true });
  }

  async join(accountId: string, code: string) {
    const existingLobby = await this.lobbyModel.findOne({code}).exec();

    if(!existingLobby) {
      throw new NotFoundException("Lobby with this code not found");
    }

    let newGuestList = existingLobby.guests;
    newGuestList.push(accountId);
    
    let result = await this.lobbyModel.findByIdAndUpdate(existingLobby._id, {guests: newGuestList}, { new: true });
    return result;
  }

  async deleteLobby(id: string) {
    const existingGame = await this.lobbyModel.findByIdAndDelete(id).exec();

    if(!existingGame) {
      throw new NotFoundException("Game was not found");
    }

    return HttpStatus.NO_CONTENT;
  }
}