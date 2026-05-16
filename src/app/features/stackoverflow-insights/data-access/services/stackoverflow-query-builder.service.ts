import { Injectable } from '@angular/core';

import { StackOverflowInsightsParams } from '../../models/stackoverflow-insights.model';

export interface StackOverflowApiSearchParams {
    readonly site: 'stackoverflow';
    readonly tagged?: string;
    readonly intitle?: string;
    readonly page: number;
    readonly pagesize: number;
    readonly order: 'asc' | 'desc';
    readonly sort: 'activity' | 'votes' | 'creation' | 'relevance';
    readonly filter: 'default';
}

@Injectable({
    providedIn: 'root',
})
export class StackOverflowQueryBuilderService {
    build(params: StackOverflowInsightsParams): StackOverflowApiSearchParams {
        const tags = params.tags
            .map((tag) => tag.trim())
            .filter(Boolean)
            .slice(0, 4);

        return {
            site: 'stackoverflow',
            tagged: tags.length > 0 ? tags.join(';') : undefined,
            intitle: params.query?.trim() || undefined,
            page: Math.max(params.page ?? 1, 1),
            pagesize: Math.min(Math.max(params.pageSize ?? 12, 1), 20),
            order: params.order ?? 'desc',
            sort: params.sort ?? 'activity',
            filter: 'default',
        };
    }
}