import { IsString, IsNotEmpty } from 'class-validator'

export class CreateLobbyDto {
  @IsNotEmpty()
  @IsString()
  game: string;
}