export type GithubRepositorySearchSort =
    | 'best-match'
    | 'stars'
    | 'forks'
    | 'help-wanted-issues'
    | 'updated';

export type GithubRepositorySearchOrder = 'asc' | 'desc';

export interface GithubRepositorySearchParams {
    readonly query: string;
    readonly language?: string;
    readonly topic?: string;
    readonly minStars?: number;
    readonly pushedAfter?: string;
    readonly createdAfter?: string;
    readonly includeForks?: boolean;
    readonly sort?: GithubRepositorySearchSort;
    readonly order?: GithubRepositorySearchOrder;
    readonly page?: number;
    readonly perPage?: number;
}