import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiClientService } from '../../../../core/api/services/api-client.service';
import { CacheKeyBuilder } from '../../../../core/cache/utils/cache-key.builder';
import { CachedDataState } from '../../../../core/cache/models/cached-data-state.model';
import { SHORT_LIVED_CACHE_POLICY } from '../../../../core/cache/models/cache-policy.model';
import { StaleWhileRevalidateService } from '../../../../core/cache/services/stale-while-revalidate.service';

import { DevArticleDto } from '../dto/dev-article.dto';
import { DevArticleMapper } from '../mappers/dev-article.mapper';
import { DevArticle } from '../../models/dev-article.model';

export interface DevArticleSearchParams {
    readonly tag: string;
    readonly page?: number;
    readonly perPage?: number;
    readonly top?: number;
}

@Injectable({
    providedIn: 'root',
})
export class DevArticlesRepository {
    private readonly apiClient = inject(ApiClientService);
    private readonly mapper = inject(DevArticleMapper);
    private readonly staleWhileRevalidate = inject(StaleWhileRevalidateService);

    searchByTag(
        params: DevArticleSearchParams,
        forceRefresh = false,
    ): Observable<CachedDataState<readonly DevArticle[]>> {
        const normalizedParams = this.normalizeParams(params);

        const cacheKey = CacheKeyBuilder.build({
            provider: 'devTo',
            resource: 'articles-by-tag',
            params: normalizedParams,
        });

        return this.staleWhileRevalidate.load<readonly DevArticle[]>({
            cacheKey,
            provider: 'devTo',
            resource: 'articles-by-tag',
            ttlSeconds: SHORT_LIVED_CACHE_POLICY.ttlSeconds,
            forceRefresh,
            fetcher: () => this.fetchByTag(normalizedParams),
        });
    }

    private fetchByTag(
        params: Required<DevArticleSearchParams>,
    ): Observable<readonly DevArticle[]> {
        return this.apiClient
            .get<readonly DevArticleDto[]>('devTo', '/articles', {
                params: {
                    tag: params.tag,
                    page: params.page,
                    per_page: params.perPage,
                    top: params.top,
                },
                headers: {
                    Accept: 'application/vnd.forem.api-v1+json',
                },
            })
            .pipe(
                map((response) =>
                    response.map((article) => this.mapper.toArticle(article)),
                ),
            );
    }

    private normalizeParams(
        params: DevArticleSearchParams,
    ): Required<DevArticleSearchParams> {
        return {
            tag: params.tag.trim().toLowerCase(),
            page: Math.max(params.page ?? 1, 1),
            perPage: Math.min(Math.max(params.perPage ?? 6, 1), 10),
            top: params.top ?? 30,
        };
    }
}