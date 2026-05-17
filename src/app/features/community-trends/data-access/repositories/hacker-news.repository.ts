import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiClientService } from '../../../../core/api/services/api-client.service';
import { CacheKeyBuilder } from '../../../../core/cache/utils/cache-key.builder';
import { CachedDataState } from '../../../../core/cache/models/cached-data-state.model';
import { SHORT_LIVED_CACHE_POLICY } from '../../../../core/cache/models/cache-policy.model';
import { StaleWhileRevalidateService } from '../../../../core/cache/services/stale-while-revalidate.service';

import { HackerNewsItemDto } from '../dto/hacker-news-item.dto';
import { HackerNewsMapper } from '../mappers/hacker-news.mapper';
import { HackerNewsStory } from '../../models/hacker-news-story.model';

export interface HackerNewsTrendParams {
    readonly keywords: readonly string[];
    readonly storyLimit?: number;
    readonly candidateLimit?: number;
}

@Injectable({
    providedIn: 'root',
})
export class HackerNewsRepository {
    private readonly apiClient = inject(ApiClientService);
    private readonly mapper = inject(HackerNewsMapper);
    private readonly staleWhileRevalidate = inject(StaleWhileRevalidateService);

    getTopStorySignals(
        params: HackerNewsTrendParams,
        forceRefresh = false,
    ): Observable<CachedDataState<readonly HackerNewsStory[]>> {
        const normalizedParams = this.normalizeParams(params);

        const cacheKey = CacheKeyBuilder.build({
            provider: 'hackerNews',
            resource: 'top-story-signals',
            params: {
                keywords: [...normalizedParams.keywords].sort(),
                storyLimit: normalizedParams.storyLimit,
                candidateLimit: normalizedParams.candidateLimit,
            },
        });

        return this.staleWhileRevalidate.load<readonly HackerNewsStory[]>({
            cacheKey,
            provider: 'hackerNews',
            resource: 'top-story-signals',
            ttlSeconds: SHORT_LIVED_CACHE_POLICY.ttlSeconds,
            forceRefresh,
            fetcher: () => this.fetchTopStorySignals(normalizedParams),
        });
    }

    private fetchTopStorySignals(
        params: Required<HackerNewsTrendParams>,
    ): Observable<readonly HackerNewsStory[]> {
        return this.apiClient
            .get<readonly number[]>('hackerNews', '/topstories.json', {
                headers: {
                    Accept: 'application/json',
                },
            })
            .pipe(
                map((ids) => ids.slice(0, params.candidateLimit)),
                switchMap((ids) => {
                    if (ids.length === 0) {
                        return of([]);
                    }

                    const itemRequests = ids.map((id) =>
                        this.apiClient
                            .get<HackerNewsItemDto>('hackerNews', `/item/${id}.json`, {
                                headers: {
                                    Accept: 'application/json',
                                },
                            })
                            .pipe(catchError(() => of(null))),
                    );

                    return forkJoin(itemRequests);
                }),
                map((items) =>
                    items
                        .map((item) =>
                            item ? this.mapper.toStory(item, params.keywords) : null,
                        )
                        .filter((story): story is HackerNewsStory => Boolean(story))
                        .sort((a, b) => b.score - a.score)
                        .slice(0, params.storyLimit),
                ),
            );
    }

    private normalizeParams(
        params: HackerNewsTrendParams,
    ): Required<HackerNewsTrendParams> {
        return {
            keywords: [...new Set(params.keywords.map((keyword) => keyword.trim().toLowerCase()).filter(Boolean))],
            storyLimit: Math.min(Math.max(params.storyLimit ?? 6, 1), 10),
            candidateLimit: Math.min(Math.max(params.candidateLimit ?? 30, 5), 50),
        };
    }
}