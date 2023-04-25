import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

@Schema()
export class Account{
    @Prop()
    _id: ObjectId;

    @Prop({required: true})
    username: string;

    @Prop({required: true})
    hashedPassword: string;

    @Prop()
    games: ObjectId;
}

export const AccountSchema = SchemaFactory.createForClass(Account);