import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { firstValueFrom, of } from 'rxjs';

import { WatchlistRepository } from '../../../../core/storage/repositories/watchlist.repository';
import { WatchlistItem } from '../../../../core/storage/models/watchlist-item.model';
import { GithubRepository } from '../../models/github-repository.model';
import { GithubWatchlistMapper } from '../mappers/github-watchlist.mapper';
import { GithubWatchlistService } from './github-watchlist.service';

describe('GithubWatchlistService', () => {
    let service: GithubWatchlistService;

    const watchlistItem: WatchlistItem = {
        id: 'github:repository:reactivex/rxjs',
        type: 'repository',
        provider: 'github',
        externalId: 'reactivex/rxjs',
        title: 'ReactiveX/rxjs',
        tags: ['typescript', 'rxjs'],
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
    };

    const repositoryMock = {
        getAll: vi.fn(),
        put: vi.fn(),
        deleteByExternalId: vi.fn(),
        delete: vi.fn(),
        exists: vi.fn(),
    };

    const mapperMock = {
        toWatchlistItem: vi.fn(),
        toExternalId: vi.fn(),
    };

    beforeEach(() => {
        repositoryMock.getAll.mockReturnValue(of([watchlistItem]));
        repositoryMock.put.mockReturnValue(of(undefined));
        repositoryMock.deleteByExternalId.mockReturnValue(of(undefined));
        repositoryMock.delete.mockReturnValue(of(undefined));
        repositoryMock.exists.mockReturnValue(of(true));

        mapperMock.toWatchlistItem.mockReturnValue(watchlistItem);
        mapperMock.toExternalId.mockReturnValue('reactivex/rxjs');

        TestBed.configureTestingModule({
            providers: [
                GithubWatchlistService,
                {
                    provide: WatchlistRepository,
                    useValue: repositoryMock,
                },
                {
                    provide: GithubWatchlistMapper,
                    useValue: mapperMock,
                },
            ],
        });

        service = TestBed.inject(GithubWatchlistService);
    });

    it('should expose saved repository external ids', async () => {
        const result = await firstValueFrom(service.savedRepositoryExternalIds$);

        expect(result.has('reactivex/rxjs')).toBe(true);
    });

    it('should save repository using watchlist repository', () => {
        const repository = createRepository();

        service.saveRepository(repository).subscribe();

        expect(mapperMock.toWatchlistItem).toHaveBeenCalledWith(repository);
        expect(repositoryMock.put).toHaveBeenCalledWith(watchlistItem);
    });

    it('should remove repository by external id', () => {
        const repository = createRepository();

        service.removeRepository(repository).subscribe();

        expect(repositoryMock.deleteByExternalId).toHaveBeenCalledWith(
            'github',
            'repository',
            'reactivex/rxjs',
        );
    });

    function createRepository(): GithubRepository {
        return {
            id: '1',
            nodeId: 'node-1',
            name: 'rxjs',
            fullName: 'ReactiveX/rxjs',
            description: 'Reactive Extensions for JavaScript',
            url: 'https://github.com/ReactiveX/rxjs',
            apiUrl: 'https://api.github.com/repos/ReactiveX/rxjs',
            owner: {
                id: '10',
                username: 'ReactiveX',
                avatarUrl: '',
                profileUrl: '',
                type: 'Organization',
            },
            stars: 31000,
            watchers: 31000,
            forks: 3000,
            openIssues: 100,
            language: 'TypeScript',
            topics: ['rxjs'],
            defaultBranch: 'master',
            sizeKb: 12000,
            isFork: false,
            isArchived: false,
            isDisabled: false,
            visibility: 'public',
            createdAt: '2015-01-01T00:00:00Z',
            updatedAt: '2026-01-01T00:00:00Z',
        };
    }
});