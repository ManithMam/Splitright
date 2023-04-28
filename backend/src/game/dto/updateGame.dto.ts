import { ApiBody, ApiProperty } from "@nestjs/swagger";
import { Result } from "../result/result.model";

export class UpdateGameDto {
    @ApiProperty()
    guestAccounts: string[]
}