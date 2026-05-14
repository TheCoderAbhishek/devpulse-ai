import { Injectable, inject } from '@angular/core';
import { defer, from, map, Observable } from 'rxjs';

import { ApiCacheRecord } from '../models/api-cache-record.model';
import { DevPulseIndexedDb } from '../../storage/indexeddb.database';

@Injectable({
    providedIn: 'root',
})
export class ApiCacheRepository {
    private readonly db = inject(DevPulseIndexedDb);

    get<T>(key: string): Observable<ApiCacheRecord<T> | null> {
        return defer(() =>
            from(this.db.apiCache.get(key) as Promise<ApiCacheRecord<T> | undefined>),
        ).pipe(map((record) => record ?? null));
    }

    put<T>(record: ApiCacheRecord<T>): Observable<void> {
        return defer(() => from(this.db.apiCache.put(record))).pipe(
            map(() => undefined),
        );
    }

    delete(key: string): Observable<void> {
        return defer(() => from(this.db.apiCache.delete(key))).pipe(
            map(() => undefined),
        );
    }

    clear(): Observable<void> {
        return defer(() => from(this.db.apiCache.clear())).pipe(
            map(() => undefined),
        );
    }

    touch(key: string): Observable<void> {
        return defer(async () => {
            const existing = await this.db.apiCache.get(key);

            if (!existing) {
                return;
            }

            await this.db.apiCache.update(key, {
                hitCount: (existing.hitCount ?? 0) + 1,
                lastAccessedAt: new Date().toISOString(),
            });
        });
    }

    deleteExpired(): Observable<number> {
        const now = new Date().toISOString();

        return defer(() =>
            from(this.db.apiCache.where('expiresAt').below(now).delete()),
        );
    }

    count(): Observable<number> {
        return defer(() => from(this.db.apiCache.count()));
    }
}