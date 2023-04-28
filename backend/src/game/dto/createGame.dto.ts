import { ApiProperty } from "@nestjs/swagger";

export class CreateGameDto {
    @ApiProperty()
    title: string;

    @ApiProperty({ enum: ['Communist', 'Lucky', 'Random']})
    splitMethod: string;

    @ApiProperty()
    amount: number;
}