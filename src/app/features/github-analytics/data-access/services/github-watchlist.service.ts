import { Injectable, inject } from '@angular/core';
import {
    BehaviorSubject,
    map,
    Observable,
    shareReplay,
    switchMap,
    tap,
} from 'rxjs';

import { WatchlistRepository } from '../../../../core/storage/repositories/watchlist.repository';
import { WatchlistItem } from '../../../../core/storage/models/watchlist-item.model';
import { GithubRepository } from '../../models/github-repository.model';
import { GithubWatchlistMapper } from '../mappers/github-watchlist.mapper';

@Injectable({
    providedIn: 'root',
})
export class GithubWatchlistService {
    private readonly watchlistRepository = inject(WatchlistRepository);
    private readonly mapper = inject(GithubWatchlistMapper);

    private readonly refreshTrigger = new BehaviorSubject<void>(undefined);

    readonly repositoryWatchlistItems$: Observable<readonly WatchlistItem[]> =
        this.refreshTrigger.pipe(
            switchMap(() => this.watchlistRepository.getAll()),
            map((items) =>
                items.filter(
                    (item) => item.provider === 'github' && item.type === 'repository',
                ),
            ),
            shareReplay({
                bufferSize: 1,
                refCount: true,
            }),
        );

    readonly savedRepositoryExternalIds$: Observable<ReadonlySet<string>> =
        this.repositoryWatchlistItems$.pipe(
            map(
                (items) =>
                    new Set(items.map((item) => item.externalId.toLowerCase())),
            ),
            shareReplay({
                bufferSize: 1,
                refCount: true,
            }),
        );

    readonly trackedRepositoryCount$: Observable<number> =
        this.repositoryWatchlistItems$.pipe(
            map((items) => items.length),
            shareReplay({
                bufferSize: 1,
                refCount: true,
            }),
        );

    saveRepository(repository: GithubRepository): Observable<void> {
        const watchlistItem = this.mapper.toWatchlistItem(repository);

        return this.watchlistRepository.put(watchlistItem).pipe(
            tap(() => this.refresh()),
        );
    }

    removeRepository(repository: GithubRepository): Observable<void> {
        return this.watchlistRepository
            .deleteByExternalId(
                'github',
                'repository',
                this.mapper.toExternalId(repository),
            )
            .pipe(tap(() => this.refresh()));
    }

    removeWatchlistItem(item: WatchlistItem): Observable<void> {
        return this.watchlistRepository.delete(item.id).pipe(
            tap(() => this.refresh()),
        );
    }

    isRepositorySaved(repository: GithubRepository): Observable<boolean> {
        return this.watchlistRepository.exists(
            'github',
            'repository',
            this.mapper.toExternalId(repository),
        );
    }

    refresh(): void {
        this.refreshTrigger.next();
    }
}