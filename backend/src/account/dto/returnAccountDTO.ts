import { IsNotEmpty, IsString } from "class-validator"
import mongoose from "mongoose";

export class returnAccountDto{   
    
    @IsNotEmpty()
    @IsString()
    username: string
    
    @IsNotEmpty()
    @IsString()
    password: string

    games: [mongoose.Types.ObjectId]

    @IsString()
    avatar: string    

}