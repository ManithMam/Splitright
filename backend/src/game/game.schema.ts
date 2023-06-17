import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Result } from './result/result.model';
import { SplitMethod } from './splitMethod.enum';

export type GameDocument = mongoose.HydratedDocument<Game & Document>;

@Schema()
export class Game {

  @Prop({ required: true })
  title: string;

  @Prop({ type: String, enum: SplitMethod, required: true })
  splitMethod: SplitMethod;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  admin: mongoose.Types.ObjectId;

  @Prop()
  results: Result[];
}

export const GameSchema = SchemaFactory.createForClass(Game);