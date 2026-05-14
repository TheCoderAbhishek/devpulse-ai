export interface CachePolicy {
    readonly ttlSeconds: number;
    readonly staleWhileRevalidate: boolean;
}

export const DEFAULT_CACHE_POLICY: CachePolicy = {
    ttlSeconds: 15 * 60,
    staleWhileRevalidate: true,
};

export const LONG_LIVED_CACHE_POLICY: CachePolicy = {
    ttlSeconds: 6 * 60 * 60,
    staleWhileRevalidate: true,
};

export const SHORT_LIVED_CACHE_POLICY: CachePolicy = {
    ttlSeconds: 5 * 60,
    staleWhileRevalidate: true,
};