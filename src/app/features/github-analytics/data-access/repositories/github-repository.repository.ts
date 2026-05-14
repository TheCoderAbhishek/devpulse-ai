import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiClientService } from '../../../../core/api/services/api-client.service';
import { CacheKeyBuilder } from '../../../../core/cache/utils/cache-key.builder';
import { CachedDataState } from '../../../../core/cache/models/cached-data-state.model';
import { StaleWhileRevalidateService } from '../../../../core/cache/services/stale-while-revalidate.service';
import { SHORT_LIVED_CACHE_POLICY } from '../../../../core/cache/models/cache-policy.model';

import { GithubSearchResponseDto } from '../dto/github-search-response.dto';
import { GithubRepositoryMapper } from '../mappers/github-repository.mapper';
import { GithubSearchQueryBuilderService } from '../services/github-search-query-builder.service';
import { GithubRepositorySearchParams } from '../../models/github-repository-search-params.model';
import { GithubRepositorySearchResult } from '../../models/github-repository-search-result.model';

export interface GithubRepositorySearchOptions {
    readonly forceRefresh?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class GithubRepositoryRepository {
    private readonly apiClient = inject(ApiClientService);
    private readonly mapper = inject(GithubRepositoryMapper);
    private readonly queryBuilder = inject(GithubSearchQueryBuilderService);
    private readonly staleWhileRevalidate = inject(StaleWhileRevalidateService);

    searchRepositories(
        params: GithubRepositorySearchParams,
        options: GithubRepositorySearchOptions = {},
    ): Observable<CachedDataState<GithubRepositorySearchResult>> {
        const normalizedParams = this.normalizeSearchParams(params);
        const builtQuery = this.queryBuilder.build(normalizedParams);

        const cacheKey = CacheKeyBuilder.build({
            provider: 'github',
            resource: 'repository-search',
            params: {
                ...normalizedParams,
                q: builtQuery,
            },
        });

        return this.staleWhileRevalidate.load<GithubRepositorySearchResult>({
            cacheKey,
            provider: 'github',
            resource: 'repository-search',
            ttlSeconds: SHORT_LIVED_CACHE_POLICY.ttlSeconds,
            forceRefresh: options.forceRefresh ?? false,
            fetcher: () => this.fetchRepositories(normalizedParams, builtQuery),
        });
    }

    private fetchRepositories(
        params: GithubRepositorySearchParams,
        builtQuery: string,
    ): Observable<GithubRepositorySearchResult> {
        const sort = params.sort === 'best-match' ? undefined : params.sort;

        return this.apiClient
            .get<GithubSearchResponseDto>('github', '/search/repositories', {
                params: {
                    q: builtQuery,
                    sort,
                    order: params.order ?? 'desc',
                    page: params.page ?? 1,
                    per_page: params.perPage ?? 12,
                },
                headers: {
                    Accept: 'application/vnd.github+json',
                },
            })
            .pipe(
                map((response) =>
                    this.mapper.toSearchResult(response, params, builtQuery),
                ),
            );
    }

    private normalizeSearchParams(
        params: GithubRepositorySearchParams,
    ): GithubRepositorySearchParams {
        return {
            query: params.query.trim(),
            language: params.language?.trim() || undefined,
            topic: params.topic?.trim() || undefined,
            minStars: params.minStars ?? 100,
            pushedAfter: params.pushedAfter,
            createdAfter: params.createdAfter,
            includeForks: params.includeForks ?? false,
            sort: params.sort ?? 'stars',
            order: params.order ?? 'desc',
            page: Math.max(params.page ?? 1, 1),
            perPage: Math.min(Math.max(params.perPage ?? 12, 1), 30),
        };
    }
}