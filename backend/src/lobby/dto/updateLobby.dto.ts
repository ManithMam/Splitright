import { IsNotEmpty, IsArray } from 'class-validator'

export class UpdateLobbyDto {
  @IsNotEmpty()
  @IsArray()
  guestUsernames: string[];
}