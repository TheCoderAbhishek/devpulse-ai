import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { WatchlistItem } from '../../../../core/storage/models/watchlist-item.model';
import { GithubWatchlistService } from '../../../github-analytics/data-access/services/github-watchlist.service';

@Component({
    selector: 'app-watchlist-home',
    imports: [AsyncPipe, DatePipe, DecimalPipe, RouterLink],
    templateUrl: './watchlist-home.html',
    styleUrl: './watchlist-home.css',
})
export class WatchlistHome {
    private readonly githubWatchlistService = inject(GithubWatchlistService);

    readonly watchlistItems$ =
        this.githubWatchlistService.repositoryWatchlistItems$;

    readonly trackedRepositoryCount$ =
        this.githubWatchlistService.trackedRepositoryCount$;

    removeItem(item: WatchlistItem): void {
        this.githubWatchlistService.removeWatchlistItem(item).subscribe();
    }

    getNumberMetric(item: WatchlistItem, key: string): number {
        const value = item.metadata?.[key];

        return typeof value === 'number' ? value : 0;
    }

    getTextMetric(item: WatchlistItem, key: string): string {
        const value = item.metadata?.[key];

        return typeof value === 'string' ? value : 'N/A';
    }
}