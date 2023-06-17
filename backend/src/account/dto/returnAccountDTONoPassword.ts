import { IsNotEmpty, IsString } from "class-validator"
import mongoose from "mongoose";

export class ReturnAccountDtoNoPassword{   

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