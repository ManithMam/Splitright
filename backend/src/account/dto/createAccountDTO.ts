import { IsNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger";

export class CreateAccountDTO {
    @ApiProperty()
    @IsNotEmpty()
    username: string

    @ApiProperty()
    @IsNotEmpty()
    password: string
}