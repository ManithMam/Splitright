import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { SplitMethod } from "../splitMethod.enum";

export class CreateGameDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ enum: SplitMethod})
    @IsEnum(SplitMethod)
    @IsNotEmpty()
    splitMethod: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    amount: number;
}