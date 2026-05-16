import { GithubRepositoryDetail } from './github-repository-detail.model';

export type GithubRepositoryDetailViewState =
    | {
        readonly status: 'loading';
        readonly owner: string;
        readonly repo: string;
    }
    | {
        readonly status: 'success';
        readonly owner: string;
        readonly repo: string;
        readonly detail: GithubRepositoryDetail;
        readonly source: 'cache' | 'network';
        readonly stale: boolean;
        readonly cachedAt?: string;
    }
    | {
        readonly status: 'error';
        readonly owner: string;
        readonly repo: string;
        readonly error: unknown;
        readonly cachedData?: GithubRepositoryDetail;
        readonly stale?: boolean;
    };