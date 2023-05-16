import { IsNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger";
import mongoose from "mongoose";

export class returnAccountDtoNoPassword{   

    @ApiProperty()
    @IsNotEmpty()
    username: string   

    games: [mongoose.Types.ObjectId]

    @ApiProperty()
    avatar: string

}