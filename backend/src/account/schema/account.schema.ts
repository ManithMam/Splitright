import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

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

AccountSchema.pre('save', async function(next){
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;        
        next();
    }
    catch(err){
        next(err);
    }
})