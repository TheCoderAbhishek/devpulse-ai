import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiClientService } from '../../../../core/api/services/api-client.service';
import { CacheKeyBuilder } from '../../../../core/cache/utils/cache-key.builder';
import { CachedDataState } from '../../../../core/cache/models/cached-data-state.model';
import { SHORT_LIVED_CACHE_POLICY } from '../../../../core/cache/models/cache-policy.model';
import { StaleWhileRevalidateService } from '../../../../core/cache/services/stale-while-revalidate.service';

import { GithubRepository } from '../../../github-analytics/models/github-repository.model';
import { StackExchangeQuestionDto } from '../dto/stack-exchange-question.dto';
import { StackExchangeResponseDto } from '../dto/stack-exchange-response.dto';
import { StackOverflowQuestionMapper } from '../mappers/stackoverflow-question.mapper';
import { StackOverflowTagBuilderService } from '../services/stackoverflow-tag-builder.service';
import { StackOverflowQueryBuilderService } from '../services/stackoverflow-query-builder.service';
import {
    StackOverflowInsights,
    StackOverflowInsightsParams,
} from '../../models/stackoverflow-insights.model';

export interface StackOverflowInsightsOptions {
    readonly forceRefresh?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class StackOverflowInsightsRepository {
    private readonly apiClient = inject(ApiClientService);
    private readonly mapper = inject(StackOverflowQuestionMapper);
    private readonly tagBuilder = inject(StackOverflowTagBuilderService);
    private readonly queryBuilder = inject(StackOverflowQueryBuilderService);
    private readonly staleWhileRevalidate = inject(StaleWhileRevalidateService);

    getInsights(
        params: StackOverflowInsightsParams,
        options: StackOverflowInsightsOptions = {},
    ): Observable<CachedDataState<StackOverflowInsights>> {
        const normalizedParams = this.normalizeParams(params);

        const cacheKey = CacheKeyBuilder.build({
            provider: 'stackExchange',
            resource: 'stackoverflow-insights',
            params: {
                tags: [...normalizedParams.tags].sort(),
                query: normalizedParams.query ?? '',
                page: normalizedParams.page ?? 1,
                pageSize: normalizedParams.pageSize ?? 12,
                sort: normalizedParams.sort ?? 'activity',
                order: normalizedParams.order ?? 'desc',
            },
        });

        return this.staleWhileRevalidate.load<StackOverflowInsights>({
            cacheKey,
            provider: 'stackExchange',
            resource: 'stackoverflow-insights',
            ttlSeconds: SHORT_LIVED_CACHE_POLICY.ttlSeconds,
            forceRefresh: options.forceRefresh ?? false,
            fetcher: () => this.fetchInsights(normalizedParams),
        });
    }

    getRepositoryInsights(
        repository: GithubRepository,
        options: StackOverflowInsightsOptions = {},
    ): Observable<CachedDataState<StackOverflowInsights>> {
        const tags = this.tagBuilder.fromRepository(repository);

        return this.getInsights(
            {
                tags,
                page: 1,
                pageSize: 12,
                sort: 'activity',
                order: 'desc',
            },
            options,
        );
    }

    private fetchInsights(
        params: StackOverflowInsightsParams,
    ): Observable<StackOverflowInsights> {
        const apiParams = this.queryBuilder.build(params);

        return this.apiClient
            .get<StackExchangeResponseDto<StackExchangeQuestionDto>>(
                'stackExchange',
                '/search/advanced',
                {
                    params: apiParams,
                    headers: {
                        Accept: 'application/json',
                    },
                },
            )
            .pipe(map((response) => this.mapper.toInsights(response, params)));
    }

    private normalizeParams(
        params: StackOverflowInsightsParams,
    ): StackOverflowInsightsParams {
        return {
            tags: [...new Set(params.tags.map((tag) => tag.trim()).filter(Boolean))],
            query: params.query?.trim() || undefined,
            page: Math.max(params.page ?? 1, 1),
            pageSize: Math.min(Math.max(params.pageSize ?? 12, 1), 20),
            sort: params.sort ?? 'activity',
            order: params.order ?? 'desc',
        };
    }
}