import { GuestAccount } from "./guestAccount";

export interface GetLobbyDto {
    id?: string;
    gameId: string;
    code: string,
    guestAccounts?: GuestAccount[]
}