import { IsNotEmpty, IsString } from "class-validator"

export class UpdateAccountUsernameDto {

    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    newName: string;

}

export class UsernameDto {

    @IsNotEmpty()
    @IsString()
    newUsername: string;

}