import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class UpdateGameDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    guestAccounts: string[];

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lobbyId: string
}