import { Injectable } from '@angular/core';

import {
    ApiCacheRecord,
    CreateApiCacheRecordParams,
} from '../models/api-cache-record.model';

@Injectable({
    providedIn: 'root',
})
export class CachePolicyService {
    createRecord<T>(params: CreateApiCacheRecordParams<T>): ApiCacheRecord<T> {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + params.ttlSeconds * 1000);

        return {
            key: params.key,
            provider: params.provider,
            resource: params.resource,
            value: params.value,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
            staleWhileRevalidate: params.staleWhileRevalidate ?? true,
            version: params.version ?? 1,
            hitCount: 0,
            sizeInBytes: this.estimateSizeInBytes(params.value),
        };
    }

    isFresh(record: ApiCacheRecord): boolean {
        return new Date(record.expiresAt).getTime() > Date.now();
    }

    isExpired(record: ApiCacheRecord): boolean {
        return !this.isFresh(record);
    }

    isStaleButUsable(record: ApiCacheRecord): boolean {
        return this.isExpired(record) && record.staleWhileRevalidate;
    }

    private estimateSizeInBytes(value: unknown): number {
        try {
            return new Blob([JSON.stringify(value)]).size;
        } catch {
            return 0;
        }
    }
}