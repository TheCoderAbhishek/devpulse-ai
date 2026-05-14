import { GithubRepository } from './github-repository.model';
import { GithubRepositorySearchParams } from './github-repository-search-params.model';

export interface GithubRepositorySearchResult {
    readonly totalCount: number;
    readonly incompleteResults: boolean;
    readonly repositories: readonly GithubRepository[];
    readonly page: number;
    readonly perPage: number;
    readonly query: string;
    readonly params: GithubRepositorySearchParams;
}