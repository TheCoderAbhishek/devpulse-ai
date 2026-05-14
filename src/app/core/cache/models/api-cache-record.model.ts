import { ApiProviderId } from '../../api/models/api-provider.model';

export interface ApiCacheRecord<T = unknown> {
    readonly key: string;
    readonly provider: ApiProviderId;
    readonly resource: string;
    readonly value: T;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly expiresAt: string;
    readonly staleWhileRevalidate: boolean;
    readonly version: number;
    readonly hitCount: number;
    readonly lastAccessedAt?: string;
    readonly sizeInBytes?: number;
}

export interface CreateApiCacheRecordParams<T> {
    readonly key: string;
    readonly provider: ApiProviderId;
    readonly resource: string;
    readonly value: T;
    readonly ttlSeconds: number;
    readonly staleWhileRevalidate?: boolean;
    readonly version?: number;
}