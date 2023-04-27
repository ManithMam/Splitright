import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Result } from './result/result.model';

export type GameDocument = mongoose.HydratedDocument<Game & Document>;

@Schema()
export class Game {

  @Prop({ required: true })
  title: string;

  @Prop({ type: String, enum: ['Communist', 'Lucky', 'Random'] })
  spliMethod: string;

  @Prop()
  code: string;

  @Prop()
  amount: number;

  @Prop()
  admin: mongoose.Types.ObjectId;

  @Prop()
  results: Result[];
}

export const GameSchema = SchemaFactory.createForClass(Game);