export interface MatchResult {
    matchStr: string;
    value: string;
}
export declare function getMatched(start?: string, end?: string, str?: string): MatchResult;
