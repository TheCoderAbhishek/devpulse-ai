import { Injectable, inject } from '@angular/core';
import { defer, from, map, Observable } from 'rxjs';

import { ApiProviderId } from '../../api/models/api-provider.model';
import { DevPulseIndexedDb } from '../indexeddb.database';
import {
    WatchlistItem,
    WatchlistItemType,
} from '../models/watchlist-item.model';

@Injectable({
    providedIn: 'root',
})
export class WatchlistRepository {
    private readonly db = inject(DevPulseIndexedDb);

    getAll(): Observable<readonly WatchlistItem[]> {
        return defer(() =>
            from(this.db.watchlistItems.orderBy('updatedAt').reverse().toArray()),
        );
    }

    getById(id: string): Observable<WatchlistItem | null> {
        return defer(() => from(this.db.watchlistItems.get(id))).pipe(
            map((item) => item ?? null),
        );
    }

    getByExternalId(
        provider: ApiProviderId,
        type: WatchlistItemType,
        externalId: string,
    ): Observable<WatchlistItem | null> {
        return defer(async () => {
            const normalizedExternalId = externalId.toLowerCase();

            const matches = await this.db.watchlistItems
                .where('externalId')
                .equals(normalizedExternalId)
                .toArray();

            return (
                matches.find(
                    (item) => item.provider === provider && item.type === type,
                ) ?? null
            );
        });
    }

    exists(
        provider: ApiProviderId,
        type: WatchlistItemType,
        externalId: string,
    ): Observable<boolean> {
        return this.getByExternalId(provider, type, externalId).pipe(
            map((item) => Boolean(item)),
        );
    }

    put(item: WatchlistItem): Observable<void> {
        return defer(() => from(this.db.watchlistItems.put(item))).pipe(
            map(() => undefined),
        );
    }

    delete(id: string): Observable<void> {
        return defer(() => from(this.db.watchlistItems.delete(id))).pipe(
            map(() => undefined),
        );
    }

    deleteByExternalId(
        provider: ApiProviderId,
        type: WatchlistItemType,
        externalId: string,
    ): Observable<void> {
        return defer(async () => {
            const normalizedExternalId = externalId.toLowerCase();

            const matches = await this.db.watchlistItems
                .where('externalId')
                .equals(normalizedExternalId)
                .toArray();

            const idsToDelete = matches
                .filter((item) => item.provider === provider && item.type === type)
                .map((item) => item.id);

            if (idsToDelete.length === 0) {
                return;
            }

            await this.db.watchlistItems.bulkDelete(idsToDelete);
        });
    }

    clear(): Observable<void> {
        return defer(() => from(this.db.watchlistItems.clear())).pipe(
            map(() => undefined),
        );
    }

    count(): Observable<number> {
        return defer(() => from(this.db.watchlistItems.count()));
    }

    countByType(
        provider: ApiProviderId,
        type: WatchlistItemType,
    ): Observable<number> {
        return defer(async () => {
            const items = await this.db.watchlistItems
                .where('provider')
                .equals(provider)
                .toArray();

            return items.filter((item) => item.type === type).length;
        });
    }
}