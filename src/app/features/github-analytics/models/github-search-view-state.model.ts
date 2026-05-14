import { GithubRepositorySearchParams } from './github-repository-search-params.model';
import { GithubRepositorySearchResult } from './github-repository-search-result.model';

export type GithubSearchViewState =
    | {
        readonly status: 'idle';
    }
    | {
        readonly status: 'loading';
        readonly params: GithubRepositorySearchParams;
    }
    | {
        readonly status: 'success';
        readonly params: GithubRepositorySearchParams;
        readonly result: GithubRepositorySearchResult;
        readonly source: 'cache' | 'network';
        readonly stale: boolean;
        readonly cachedAt?: string;
    }
    | {
        readonly status: 'error';
        readonly params: GithubRepositorySearchParams;
        readonly error: unknown;
        readonly cachedData?: GithubRepositorySearchResult;
        readonly stale?: boolean;
    };