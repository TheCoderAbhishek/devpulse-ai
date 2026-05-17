import { TestBed } from '@angular/core/testing';
import { Subscription, of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GithubRepositoryRepository } from '../data-access/repositories/github-repository.repository';
import { GithubRepositorySearchResult } from '../models/github-repository-search-result.model';
import { GithubSearchStore } from './github-search.store';

describe('GithubSearchStore', () => {
    let store: GithubSearchStore;
    let subscription: Subscription | undefined;

    const searchResult: GithubRepositorySearchResult = {
        totalCount: 1,
        incompleteResults: false,
        repositories: [],
        page: 1,
        perPage: 12,
        query: 'angular',
        params: {
            query: 'angular',
            page: 1,
            perPage: 12,
        },
    };

    const repositoryMock = {
        searchRepositories: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();

        repositoryMock.searchRepositories.mockReturnValue(
            of({
                status: 'success',
                data: searchResult,
                source: 'network',
                stale: false,
                cachedAt: '2026-01-01T00:00:00Z',
            }),
        );

        TestBed.configureTestingModule({
            providers: [
                GithubSearchStore,
                {
                    provide: GithubRepositoryRepository,
                    useValue: repositoryMock,
                },
            ],
        });

        store = TestBed.inject(GithubSearchStore);
    });

    afterEach(() => {
        subscription?.unsubscribe();
        subscription = undefined;
    });

    it('should emit loading and success states for immediate search', () => {
        const statuses: string[] = [];

        subscription = store.vm$.subscribe((state) => {
            statuses.push(state.status);
        });

        store.searchNow({
            query: 'angular',
            language: 'TypeScript',
            minStars: 1000,
            page: 1,
            perPage: 12,
        });

        expect(statuses).toContain('idle');
        expect(statuses).toContain('loading');
        expect(statuses).toContain('success');
        expect(repositoryMock.searchRepositories).toHaveBeenCalled();
    });

    it('should force refresh when refresh is called', () => {
        subscription = store.vm$.subscribe();

        store.searchNow({
            query: 'rxjs',
            page: 1,
            perPage: 12,
        });

        store.refresh();

        expect(repositoryMock.searchRepositories).toHaveBeenCalledWith(
            expect.objectContaining({
                query: 'rxjs',
            }),
            expect.objectContaining({
                forceRefresh: true,
            }),
        );
    });
});