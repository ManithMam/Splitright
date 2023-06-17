import { IsNotEmpty, IsString } from "class-validator"
import mongoose from "mongoose";

export class ReturnAccountDto{   
    
    @IsNotEmpty()
    @IsString()
    username: string
    
    @IsNotEmpty()
    @IsString()
    password: string

    games: [mongoose.Types.ObjectId]

    @IsString()
    avatar: string    

    @IsString()
    @IsNotEmpty()
    id: string

}