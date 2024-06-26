import { IsNotEmpty, IsString } from "class-validator"


export class AccountDto {
   
    @IsNotEmpty()
    @IsString()
    username: string
   
    @IsNotEmpty()
    @IsString()
    password: string
}

export class AccountUsernameDto {

    @IsNotEmpty()
    @IsString()
    username: string

}