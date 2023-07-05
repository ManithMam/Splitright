import { ItemInfos } from "./ItemInfos";

export interface GameDetails {
    title: string, 
    mode: string, 
    amount: number,
    adminUsername: string,
    results: ItemInfos[]
}