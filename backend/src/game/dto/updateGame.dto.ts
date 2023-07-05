import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class UpdateGameDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    guestAccountIds: string[];
}