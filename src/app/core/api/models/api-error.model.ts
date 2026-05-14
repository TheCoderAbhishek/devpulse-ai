import { ApiProviderId } from './api-provider.model';

export type ApiErrorType =
    | 'network'
    | 'timeout'
    | 'unauthorized'
    | 'forbidden'
    | 'not-found'
    | 'rate-limited'
    | 'validation'
    | 'server'
    | 'cancelled'
    | 'unknown';

export interface ApiError {
    readonly type: ApiErrorType;
    readonly provider?: ApiProviderId;
    readonly statusCode?: number;
    readonly message: string;
    readonly technicalMessage?: string;
    readonly retryable: boolean;
    readonly recoverable: boolean;
    readonly rateLimitResetAt?: string;
    readonly correlationId?: string;
    readonly createdAt: string;
}

export function createApiError(params: Omit<ApiError, 'createdAt'>): ApiError {
    return {
        ...params,
        createdAt: new Date().toISOString(),
    };
}