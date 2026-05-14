import { Injectable, inject } from '@angular/core';
import { catchError, defer, from, map, Observable, of } from 'rxjs';

import { DevPulseIndexedDb } from '../indexeddb.database';
import { ApiCacheRecord } from '../../cache/models/api-cache-record.model';

@Injectable({
    providedIn: 'root',
})
export class IndexedDbHealthService {
    private readonly db = inject(DevPulseIndexedDb);

    verify(): Observable<boolean> {
        return defer(async () => {
            const key = `storage-health:${crypto.randomUUID()}`;
            const now = new Date().toISOString();

            const record: ApiCacheRecord = {
                key,
                provider: 'github',
                resource: 'storage-health-check',
                value: {
                    ok: true,
                },
                createdAt: now,
                updatedAt: now,
                expiresAt: new Date(Date.now() + 60_000).toISOString(),
                staleWhileRevalidate: false,
                version: 1,
                hitCount: 0,
            };

            await this.db.apiCache.put(record);

            const savedRecord = await this.db.apiCache.get(key);

            await this.db.apiCache.delete(key);

            return Boolean(savedRecord);
        }).pipe(
            map((result) => result),
            catchError(() => of(false)),
        );
    }
}