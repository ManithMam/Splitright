import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type LobbyDocument = mongoose.HydratedDocument<Lobby & Document>;

@Schema()
export class Lobby {
  @Prop()
  gameId: string;

  @Prop()
  adminId: string;

  @Prop()
  code: string;

  @Prop({ type: [{ type: String, ref: 'Account' }] })
  guestIds?: string[];
}

export const LobbySchema = SchemaFactory.createForClass(Lobby);