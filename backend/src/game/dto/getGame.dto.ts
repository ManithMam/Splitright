import { Result } from "../result/result.model";

export class GetGameDto {
    id: string;

    title: string;

    splitMethod: string;

    amount: number;

    admin: string;

    results: Result[]
}