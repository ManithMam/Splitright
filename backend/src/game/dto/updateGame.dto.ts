import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";

export class UpdateGameDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    guestAccounts: string[]
}