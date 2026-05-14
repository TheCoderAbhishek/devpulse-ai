import { ApiProviderId } from './api-provider.model';

export interface ApiResponseMeta {
    readonly provider: ApiProviderId;
    readonly requestUrl: string;
    readonly cached: boolean;
    readonly stale: boolean;
    readonly receivedAt: string;
    readonly correlationId: string;
    readonly rateLimitRemaining?: number;
    readonly rateLimitResetAt?: string;
}

export interface ApiResponse<T> {
    readonly data: T;
    readonly meta: ApiResponseMeta;
}