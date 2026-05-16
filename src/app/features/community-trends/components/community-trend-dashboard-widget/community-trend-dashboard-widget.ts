import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map } from 'rxjs';

import { GithubWatchlistService } from '../../../github-analytics/data-access/services/github-watchlist.service';

@Component({
    selector: 'app-community-trend-dashboard-widget',
    imports: [AsyncPipe, DecimalPipe],
    templateUrl: './community-trend-dashboard-widget.html',
    styleUrl: './community-trend-dashboard-widget.css',
})
export class CommunityTrendDashboardWidget {
    private readonly githubWatchlistService = inject(GithubWatchlistService);

    readonly vm$ = this.githubWatchlistService.repositoryWatchlistItems$.pipe(
        map((items) => {
            const languageCounts = new Map<string, number>();
            const topicCounts = new Map<string, number>();

            for (const item of items) {
                const language = item.metadata?.['language'];

                if (typeof language === 'string' && language.trim()) {
                    languageCounts.set(language, (languageCounts.get(language) ?? 0) + 1);
                }

                for (const tag of item.tags) {
                    topicCounts.set(tag, (topicCounts.get(tag) ?? 0) + 1);
                }
            }

            return {
                trackedCount: items.length,
                topLanguages: [...languageCounts.entries()]
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5),
                topTopics: [...topicCounts.entries()]
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8),
            };
        }),
    );
}