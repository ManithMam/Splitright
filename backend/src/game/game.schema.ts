import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Result } from './result/result.model';
import { Mode } from './mode.enum';

export type GameDocument = mongoose.HydratedDocument<Game & Document>;

@Schema()
export class Game {

  @Prop({ required: true })
  title: string;

  @Prop({ type: String, enum: Mode, required: true })
  mode: Mode;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  adminId: mongoose.Types.ObjectId;

  @Prop({default: []})
  results: Result[];
}

export const GameSchema = SchemaFactory.createForClass(Game);