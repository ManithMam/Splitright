import { GuestAccount } from "./GuestAccount";

export interface Lobby {
    gameId: string;
    code: string,
    guestAccounts?: GuestAccount[]
}