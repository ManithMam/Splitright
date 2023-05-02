import { IsNotEmpty } from "class-validator"

export class updateAccountGameDto{
    @IsNotEmpty()
    gameId: string

    @IsNotEmpty()
    accountId: string
}