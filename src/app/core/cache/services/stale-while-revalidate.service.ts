import { Injectable, inject } from '@angular/core';
import {
    catchError,
    concat,
    map,
    Observable,
    of,
    switchMap,
} from 'rxjs';

import { ApiProviderId } from '../../api/models/api-provider.model';
import { ApiCacheRepository } from '../repositories/api-cache.repository';
import { CachedDataState } from '../models/cached-data-state.model';
import { CachePolicyService } from './cache-policy.service';

export interface StaleWhileRevalidateOptions<T> {
    readonly cacheKey: string;
    readonly provider: ApiProviderId;
    readonly resource: string;
    readonly ttlSeconds: number;
    readonly forceRefresh?: boolean;
    readonly fetcher: () => Observable<T>;
}

@Injectable({
    providedIn: 'root',
})
export class StaleWhileRevalidateService {
    private readonly cacheRepository = inject(ApiCacheRepository);
    private readonly cachePolicy = inject(CachePolicyService);

    load<T>(options: StaleWhileRevalidateOptions<T>): Observable<CachedDataState<T>> {
        if (options.forceRefresh) {
            return this.fetchAndCache(options);
        }

        return this.cacheRepository.get<T>(options.cacheKey).pipe(
            switchMap((cachedRecord) => {
                if (cachedRecord && this.cachePolicy.isFresh(cachedRecord)) {
                    this.cacheRepository.touch(options.cacheKey).subscribe();

                    return of({
                        status: 'success',
                        data: cachedRecord.value,
                        source: 'cache',
                        stale: false,
                        cachedAt: cachedRecord.updatedAt,
                    } satisfies CachedDataState<T>);
                }

                if (cachedRecord && this.cachePolicy.isStaleButUsable(cachedRecord)) {
                    this.cacheRepository.touch(options.cacheKey).subscribe();

                    return concat(
                        of({
                            status: 'success',
                            data: cachedRecord.value,
                            source: 'cache',
                            stale: true,
                            cachedAt: cachedRecord.updatedAt,
                        } satisfies CachedDataState<T>),
                        this.fetchAndCache(options, cachedRecord.value),
                    );
                }

                return concat(
                    of({
                        status: 'loading',
                    } satisfies CachedDataState<T>),
                    this.fetchAndCache(options),
                );
            }),
        );
    }

    private fetchAndCache<T>(
        options: StaleWhileRevalidateOptions<T>,
        cachedFallback?: T,
    ): Observable<CachedDataState<T>> {
        return options.fetcher().pipe(
            switchMap((data) => {
                const record = this.cachePolicy.createRecord({
                    key: options.cacheKey,
                    provider: options.provider,
                    resource: options.resource,
                    value: data,
                    ttlSeconds: options.ttlSeconds,
                    staleWhileRevalidate: true,
                });

                return this.cacheRepository.put(record).pipe(
                    map(
                        () =>
                            ({
                                status: 'success',
                                data,
                                source: 'network',
                                stale: false,
                                cachedAt: record.updatedAt,
                            }) satisfies CachedDataState<T>,
                    ),
                );
            }),
            catchError((error: unknown) =>
                of({
                    status: 'error',
                    error,
                    cachedData: cachedFallback,
                    stale: Boolean(cachedFallback),
                } satisfies CachedDataState<T>),
            ),
        );
    }
}