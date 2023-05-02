import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Schema as mongooseSchema, HydratedDocument} from 'mongoose';

export type AccountDocument = HydratedDocument<Account & Document>

@Schema()
export class Account{   

    @Prop({required: true})
    username: string;

    @Prop({required: true, unique: true})
    password: string;

    @Prop()
    games?: [mongoose.Types.ObjectId]

    @Prop()
    avatar?: string
}

export const AccountSchema = SchemaFactory.createForClass(Account);