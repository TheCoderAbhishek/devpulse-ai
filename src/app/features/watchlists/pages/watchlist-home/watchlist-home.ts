import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { WatchlistItem } from '../../../../core/storage/models/watchlist-item.model';
import { GithubWatchlistService } from '../../../github-analytics/data-access/services/github-watchlist.service';
import { WatchlistHealthOverview } from '../../components/watchlist-health-overview/watchlist-health-overview';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { AppEmptyState } from '../../../../shared/components/empty-state/app-empty-state/app-empty-state';

@Component({
    selector: 'app-watchlist-home',
    imports: [
        AsyncPipe,
        DatePipe,
        DecimalPipe,
        RouterLink,
        WatchlistHealthOverview,
        AppEmptyState
    ],
    templateUrl: './watchlist-home.html',
    styleUrl: './watchlist-home.css',
})
export class WatchlistHome {
    private readonly githubWatchlistService = inject(GithubWatchlistService);
    private readonly confirmDialogService = inject(ConfirmDialogService);
    private readonly toastService = inject(ToastService);

    readonly watchlistItems$ =
        this.githubWatchlistService.repositoryWatchlistItems$;

    readonly trackedRepositoryCount$ =
        this.githubWatchlistService.trackedRepositoryCount$;

    async removeItem(item: WatchlistItem): Promise<void> {
        const confirmed = await this.confirmDialogService.confirm({
            title: 'Remove repository?',
            message: `Remove ${item.title} from your local watchlist?`,
            confirmLabel: 'Remove',
            cancelLabel: 'Cancel',
            tone: 'danger',
        });

        if (!confirmed) {
            return;
        }

        this.githubWatchlistService.removeWatchlistItem(item).subscribe({
            next: () => {
                this.toastService.info(
                    'Repository removed',
                    `${item.title} was removed from your watchlist.`,
                );
            },
            error: () => {
                this.toastService.error(
                    'Remove failed',
                    'Unable to remove repository from the watchlist.',
                );
            },
        });
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