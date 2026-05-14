export type CachedDataSource = 'cache' | 'network';

export type CachedDataState<T> =
    | {
        readonly status: 'loading';
    }
    | {
        readonly status: 'success';
        readonly data: T;
        readonly source: CachedDataSource;
        readonly stale: boolean;
        readonly cachedAt?: string;
    }
    | {
        readonly status: 'error';
        readonly error: unknown;
        readonly cachedData?: T;
        readonly stale?: boolean;
    };