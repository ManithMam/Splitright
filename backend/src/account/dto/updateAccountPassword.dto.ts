import { IsNotEmpty, IsString } from "class-validator"

export class UpdateAccountPasswordDto {

    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    newPassword: string;

}

export class PasswordDto {

    @IsNotEmpty()
    @IsString()
    newPassword: string;

}