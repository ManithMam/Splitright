import { IsNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger";

export class AccountDto {
    @ApiProperty()
    @IsNotEmpty()
    username: string

    @ApiProperty()
    @IsNotEmpty()
    password: string
}