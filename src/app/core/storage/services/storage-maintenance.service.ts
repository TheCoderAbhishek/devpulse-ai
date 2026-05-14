import { Injectable, inject } from '@angular/core';
import { defer, from, Observable } from 'rxjs';

import { ApiCacheRepository } from '../../cache/repositories/api-cache.repository';
import { DevPulseIndexedDb } from '../indexeddb.database';

export interface StorageStats {
    readonly apiCacheCount: number;
    readonly watchlistCount: number;
    readonly bookmarkCount: number;
    readonly dashboardLayoutCount: number;
}

@Injectable({
    providedIn: 'root',
})
export class StorageMaintenanceService {
    private readonly db = inject(DevPulseIndexedDb);
    private readonly apiCacheRepository = inject(ApiCacheRepository);

    deleteExpiredCache(): Observable<number> {
        return this.apiCacheRepository.deleteExpired();
    }

    getStats(): Observable<StorageStats> {
        return defer(async () => {
            const [
                apiCacheCount,
                watchlistCount,
                bookmarkCount,
                dashboardLayoutCount,
            ] = await Promise.all([
                this.db.apiCache.count(),
                this.db.watchlistItems.count(),
                this.db.bookmarkItems.count(),
                this.db.dashboardLayouts.count(),
            ]);

            return {
                apiCacheCount,
                watchlistCount,
                bookmarkCount,
                dashboardLayoutCount,
            };
        });
    }

    clearAllLocalData(): Observable<void> {
        return defer(() =>
            from(
                Promise.all([
                    this.db.apiCache.clear(),
                    this.db.watchlistItems.clear(),
                    this.db.bookmarkItems.clear(),
                    this.db.dashboardLayouts.clear(),
                ]).then(() => undefined),
            ),
        );
    }
}