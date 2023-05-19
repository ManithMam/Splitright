import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LobbyDocument = Lobby & Document;

@Schema()
export class Lobby {
  @Prop()
  game: string;

  @Prop({ type: [{ type: String, ref: 'User' }] })
  guests?: string[];
}

export const LobbySchema = SchemaFactory.createForClass(Lobby);