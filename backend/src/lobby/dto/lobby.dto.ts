import { IsArray, IsString, IsNotEmpty, IsOptional } from 'class-validator'
import {Exclude, Expose} from "class-transformer" 
import { ApiProperty } from "@nestjs/swagger";

export class LobbyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  game: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  guests?: string[];
}