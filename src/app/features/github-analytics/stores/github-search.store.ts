import { Injectable, inject } from '@angular/core';
import {
    BehaviorSubject,
    catchError,
    debounceTime,
    distinctUntilChanged,
    map,
    merge,
    Observable,
    of,
    shareReplay,
    startWith,
    Subject,
    switchMap,
} from 'rxjs';

import { CachedDataState } from '../../../core/cache/models/cached-data-state.model';
import { GithubRepositoryRepository } from '../data-access/repositories/github-repository.repository';
import { GithubRepositorySearchParams } from '../models/github-repository-search-params.model';
import { GithubRepositorySearchResult } from '../models/github-repository-search-result.model';
import { GithubSearchViewState } from '../models/github-search-view-state.model';

interface GithubSearchTrigger {
    readonly params: GithubRepositorySearchParams;
    readonly forceRefresh: boolean;
}

const DEFAULT_SEARCH_PARAMS: GithubRepositorySearchParams = {
    query: 'angular rxjs',
    language: 'TypeScript',
    topic: '',
    minStars: 1000,
    includeForks: false,
    sort: 'stars',
    order: 'desc',
    page: 1,
    perPage: 12,
};

@Injectable()
export class GithubSearchStore {
    private readonly githubRepository = inject(GithubRepositoryRepository);

    private readonly searchParamsSubject =
        new BehaviorSubject<GithubRepositorySearchParams>(DEFAULT_SEARCH_PARAMS);

    private readonly immediateSearchSubject = new Subject<GithubSearchTrigger>();

    readonly vm$: Observable<GithubSearchViewState> = merge(
        this.searchParamsSubject.pipe(
            debounceTime(500),
            distinctUntilChanged((previous, current) =>
                this.areSearchParamsEqual(previous, current),
            ),
            map((params) => ({
                params,
                forceRefresh: false,
            })),
        ),
        this.immediateSearchSubject,
    ).pipe(
        switchMap((trigger) => this.search(trigger)),
        startWith({
            status: 'idle',
        } satisfies GithubSearchViewState),
        shareReplay({
            bufferSize: 1,
            refCount: true,
        }),
    );

    updateSearchParams(params: GithubRepositorySearchParams): void {
        this.searchParamsSubject.next({
            ...params,
            page: 1,
        });
    }

    searchNow(params: GithubRepositorySearchParams): void {
        this.searchParamsSubject.next({
            ...params,
            page: 1,
        });

        this.immediateSearchSubject.next({
            params: {
                ...params,
                page: 1,
            },
            forceRefresh: false,
        });
    }

    refresh(): void {
        this.immediateSearchSubject.next({
            params: this.searchParamsSubject.value,
            forceRefresh: true,
        });
    }

    private search(trigger: GithubSearchTrigger): Observable<GithubSearchViewState> {
        const normalizedParams = this.normalizeParams(trigger.params);

        if (!normalizedParams.query.trim()) {
            return of({
                status: 'idle',
            } satisfies GithubSearchViewState);
        }

        return this.githubRepository
            .searchRepositories(normalizedParams, {
                forceRefresh: trigger.forceRefresh,
            })
            .pipe(
                map((state) => this.toViewState(state, normalizedParams)),
                startWith({
                    status: 'loading',
                    params: normalizedParams,
                } satisfies GithubSearchViewState),
                catchError((error: unknown) =>
                    of({
                        status: 'error',
                        params: normalizedParams,
                        error,
                    } satisfies GithubSearchViewState),
                ),
            );
    }

    private toViewState(
        state: CachedDataState<GithubRepositorySearchResult>,
        params: GithubRepositorySearchParams,
    ): GithubSearchViewState {
        if (state.status === 'loading') {
            return {
                status: 'loading',
                params,
            };
        }

        if (state.status === 'success') {
            return {
                status: 'success',
                params,
                result: state.data,
                source: state.source,
                stale: state.stale,
                cachedAt: state.cachedAt,
            };
        }

        return {
            status: 'error',
            params,
            error: state.error,
            cachedData: state.cachedData,
            stale: state.stale,
        };
    }

    private normalizeParams(
        params: GithubRepositorySearchParams,
    ): GithubRepositorySearchParams {
        return {
            query: params.query.trim(),
            language: params.language?.trim() || undefined,
            topic: params.topic?.trim() || undefined,
            minStars: Number(params.minStars ?? 0),
            includeForks: Boolean(params.includeForks),
            sort: params.sort ?? 'stars',
            order: params.order ?? 'desc',
            page: params.page ?? 1,
            perPage: params.perPage ?? 12,
            pushedAfter: params.pushedAfter,
            createdAfter: params.createdAfter,
        };
    }

    private areSearchParamsEqual(
        previous: GithubRepositorySearchParams,
        current: GithubRepositorySearchParams,
    ): boolean {
        return JSON.stringify(previous) === JSON.stringify(current);
    }
}