import { IsArray, IsString, IsNotEmpty, IsOptional } from 'class-validator'
import {Exclude, Expose} from "class-transformer" 

export class LobbyDto {
  @IsNotEmpty()
  @IsString()
  game: string;

  @IsOptional()
  @IsArray()
  guests?: string[];
}