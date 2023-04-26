import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Schema as mongooseSchema} from 'mongoose';

export type AccountDocument = Account & Document;

@Schema()
export class Account{   
    @Prop()
    _id: mongooseSchema.Types.ObjectId;

    @Prop({required: true})
    username: string;

    @Prop({required: true})
    hashedPassword: string;

    @Prop()
    games: [mongooseSchema.Types.ObjectId];
}

export const AccountSchema = SchemaFactory.createForClass(Account);