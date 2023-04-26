import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {Document} from 'mongoose';

export type AccountDocument = Account & Document;

@Schema()
export class Account{
    @Prop()
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({required: true})
    username: string;

    @Prop({required: true})
    hashedPassword: string;

    @Prop()
    games: mongoose.Schema.Types.ObjectId;
}

export const AccountSchema = SchemaFactory.createForClass(Account);