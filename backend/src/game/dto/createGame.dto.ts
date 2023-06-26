import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { Mode } from "../mode.enum";

export class CreateGameDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ enum: Mode})
    @IsEnum(Mode)
    @IsNotEmpty()
    mode: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    amount: number;
}