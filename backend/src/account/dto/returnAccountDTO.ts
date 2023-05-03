import { IsNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger";
import mongoose from "mongoose";

export class returnAccountDto{

    @ApiProperty()
    @IsNotEmpty()
    id: mongoose.Types.ObjectId

    @ApiProperty()
    @IsNotEmpty()
    username: string

    @ApiProperty()
    @IsNotEmpty()
    password: string

    @ApiProperty()
    avatar: string

}