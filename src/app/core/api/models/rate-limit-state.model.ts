import { ApiProviderId } from './api-provider.model';

export interface RateLimitState {
    readonly provider: ApiProviderId;
    readonly limit: number;
    readonly remaining: number;
    readonly used: number;
    readonly resetAt?: string;
    readonly isLimited: boolean;
    readonly lastUpdatedAt: string;
}

export interface RateLimitSnapshot {
    readonly providers: Partial<Record<ApiProviderId, RateLimitState>>;
}