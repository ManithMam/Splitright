import { Result } from "../result/result.model";

export class GetGameDto {
    id: string;
    title: string;
    spliMethod: string;
    amount: number;
    admin: string;
    results: Result[]
}