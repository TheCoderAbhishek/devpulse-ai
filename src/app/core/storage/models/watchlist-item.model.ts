import { ApiProviderId } from '../../api/models/api-provider.model';

export type WatchlistItemType = 'repository' | 'technology' | 'search';

export interface WatchlistItem {
    readonly id: string;
    readonly type: WatchlistItemType;
    readonly provider: ApiProviderId;
    readonly externalId: string;
    readonly title: string;
    readonly subtitle?: string;
    readonly url?: string;
    readonly tags: readonly string[];
    readonly notes?: string;
    readonly metadata?: Record<string, unknown>;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly lastSyncedAt?: string;
}