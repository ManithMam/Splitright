import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Lobby } from './schemas/lobby.schema';
import { LobbyDto } from './dto/lobby.dto';


@Injectable()
export class LobbyService {
  constructor(@InjectModel(Lobby.name) private readonly lobbyModel: Model<Lobby>) {}

  async createLobby(lobbyDto: LobbyDto): Promise<Lobby> {
    const lobby = new this.lobbyModel(lobbyDto);
    return await lobby.save();
  }

  async findAllLobbies(): Promise<Lobby[]> {
    return await this.lobbyModel.find().exec();
  }

  async findOneLobby(id: string): Promise<Lobby> {
    return await this.lobbyModel.findById(id).exec();
  }

  async updateLobbyGuests(id: string, guests: string[]): Promise<Lobby> {
    return await this.lobbyModel.findByIdAndUpdate(id, { guests }, { new: true }).exec();
  }

  async deleteLobby(id: string): Promise<void> {
    await this.lobbyModel.findByIdAndDelete(id).exec();
  }
}