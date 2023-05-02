import { IsNotEmpty } from "class-validator"

export class CreateAccountDTO {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    password: string
}