import { Result } from "../result/result.model";

export class GetGameDetailsDto {
    id: string;

    title: string;

    splitMethod: string;

    amount: number;

    admin: string;

    results: Result[]
}