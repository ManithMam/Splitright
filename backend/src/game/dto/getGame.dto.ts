import { ApiBody, ApiProperty } from "@nestjs/swagger";
import { Result } from "../result/result.model";

export class GetGameDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    spliMethod: string;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    admin: string;

    @ApiProperty()
    results: Result[]
}