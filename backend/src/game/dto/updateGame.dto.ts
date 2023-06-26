import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class UpdateGameDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    guestAccountUsernames: string[];

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lobbyId: string
}