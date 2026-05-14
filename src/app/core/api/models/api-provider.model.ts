export type ApiProviderId =
    | 'github'
    | 'stackExchange'
    | 'devTo'
    | 'hackerNews'
    | 'reddit'
    | 'ai';

export type ApiProviderCategory =
    | 'code-hosting'
    | 'qa'
    | 'articles'
    | 'news'
    | 'community'
    | 'ai';

export interface ApiProviderRateLimitPolicy {
    readonly requestsPerWindow: number;
    readonly windowInSeconds: number;
    readonly supportsRateLimitHeaders: boolean;
    readonly requiresCooldownHandling: boolean;
}

export interface ApiProviderAuthConfig {
    readonly requiresAuth: boolean;
    readonly supportsOptionalAuth: boolean;
    readonly tokenStorageKey?: string;
    readonly authHeaderName?: string;
    readonly authHeaderPrefix?: string;
}

export interface ApiProviderConfig {
    readonly id: ApiProviderId;
    readonly displayName: string;
    readonly category: ApiProviderCategory;
    readonly baseUrl: string;
    readonly documentationUrl: string;
    readonly enabled: boolean;
    readonly auth: ApiProviderAuthConfig;
    readonly rateLimit: ApiProviderRateLimitPolicy;
    readonly defaultTimeoutMs: number;
}