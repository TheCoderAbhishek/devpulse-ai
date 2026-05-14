import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

import { ApiCacheRecord } from '../cache/models/api-cache-record.model';
import { BookmarkItem } from './models/bookmark-item.model';
import { DashboardLayout } from './models/dashboard-layout.model';
import { WatchlistItem } from './models/watchlist-item.model';

@Injectable({
    providedIn: 'root',
})
export class DevPulseIndexedDb extends Dexie {
    apiCache!: Table<ApiCacheRecord, string>;
    watchlistItems!: Table<WatchlistItem, string>;
    bookmarkItems!: Table<BookmarkItem, string>;
    dashboardLayouts!: Table<DashboardLayout, string>;

    constructor() {
        super('DevPulseAiDb');

        this.version(1).stores({
            apiCache:
                'key, provider, resource, expiresAt, updatedAt, lastAccessedAt',
            watchlistItems:
                'id, type, provider, externalId, title, createdAt, updatedAt, lastSyncedAt',
            bookmarkItems:
                'id, type, provider, externalId, title, sourceName, createdAt, updatedAt',
            dashboardLayouts:
                'id, name, isDefault, createdAt, updatedAt',
        });
    }
}