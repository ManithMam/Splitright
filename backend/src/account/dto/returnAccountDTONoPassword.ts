import { IsNotEmpty, IsString, isString } from "class-validator"
import mongoose from "mongoose";

export class returnAccountDtoNoPassword{   

    @IsString()
    @IsNotEmpty()
    id: string

    @IsNotEmpty()
    @IsString()
    username: string   

    games: [mongoose.Types.ObjectId]

    @IsString()
    avatar: string

}