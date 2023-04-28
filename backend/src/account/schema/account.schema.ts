import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mongooseSchema, HydratedDocument} from 'mongoose';

export type AccountDocument = HydratedDocument<Account>

@Schema()
export class Account{   

    @Prop({required: true})
    username: string;

    @Prop({required: true, unique: true})
    password: string;

    @Prop()
    games: [mongooseSchema.Types.ObjectId]
}

export const AccountSchema = SchemaFactory.createForClass(Account);