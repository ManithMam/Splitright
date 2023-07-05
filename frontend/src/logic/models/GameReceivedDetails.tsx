import { Result } from "./Result";

export interface GameReceivedDetails {
    title: string, 
    mode: string, 
    amount: number,
    adminUsername: string,
    results: Result[]
}