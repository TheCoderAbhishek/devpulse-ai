import { ApiProviderId } from '../../api/models/api-provider.model';

export type BookmarkItemType =
    | 'repository'
    | 'question'
    | 'article'
    | 'discussion'
    | 'release'
    | 'other';

export interface BookmarkItem {
    readonly id: string;
    readonly type: BookmarkItemType;
    readonly provider: ApiProviderId;
    readonly externalId: string;
    readonly title: string;
    readonly description?: string;
    readonly url?: string;
    readonly sourceName?: string;
    readonly tags: readonly string[];
    readonly notes?: string;
    readonly metadata?: Record<string, unknown>;
    readonly createdAt: string;
    readonly updatedAt: string;
}