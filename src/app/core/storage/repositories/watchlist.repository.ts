import { Injectable, inject } from '@angular/core';
import { defer, from, map, Observable } from 'rxjs';

import { DevPulseIndexedDb } from '../indexeddb.database';
import { WatchlistItem } from '../models/watchlist-item.model';

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

    clear(): Observable<void> {
        return defer(() => from(this.db.watchlistItems.clear())).pipe(
            map(() => undefined),
        );
    }

    count(): Observable<number> {
        return defer(() => from(this.db.watchlistItems.count()));
    }
}