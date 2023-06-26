import { Result } from "../result/result.model";

export class GetGameWithResults {
    title: string;

    mode: string;

    amount: number;

    adminUsername: string;

    results: Result[]
}