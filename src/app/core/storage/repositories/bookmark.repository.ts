import { Injectable, inject } from '@angular/core';
import { defer, from, map, Observable } from 'rxjs';

import { BookmarkItem } from '../models/bookmark-item.model';
import { DevPulseIndexedDb } from '../indexeddb.database';

@Injectable({
    providedIn: 'root',
})
export class BookmarkRepository {
    private readonly db = inject(DevPulseIndexedDb);

    getAll(): Observable<readonly BookmarkItem[]> {
        return defer(() =>
            from(this.db.bookmarkItems.orderBy('updatedAt').reverse().toArray()),
        );
    }

    getById(id: string): Observable<BookmarkItem | null> {
        return defer(() => from(this.db.bookmarkItems.get(id))).pipe(
            map((item) => item ?? null),
        );
    }

    put(item: BookmarkItem): Observable<void> {
        return defer(() => from(this.db.bookmarkItems.put(item))).pipe(
            map(() => undefined),
        );
    }

    delete(id: string): Observable<void> {
        return defer(() => from(this.db.bookmarkItems.delete(id))).pipe(
            map(() => undefined),
        );
    }

    clear(): Observable<void> {
        return defer(() => from(this.db.bookmarkItems.clear())).pipe(
            map(() => undefined),
        );
    }

    count(): Observable<number> {
        return defer(() => from(this.db.bookmarkItems.count()));
    }
}