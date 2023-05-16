import { IsNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger";
import mongoose from "mongoose";

export class returnAccountDto{   

    @ApiProperty()
    @IsNotEmpty()
    username: string

    @ApiProperty()
    @IsNotEmpty()
    password: string

    games: [mongoose.Types.ObjectId]

    @ApiProperty()
    avatar: string

}