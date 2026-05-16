import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { WatchlistItem } from '../../../../core/storage/models/watchlist-item.model';

interface WatchlistHealthSummary {
    readonly total: number;
    readonly archived: number;
    readonly highAdoption: number;
    readonly highIssueLoad: number;
    readonly topLanguages: readonly string[];
}

@Component({
    selector: 'app-watchlist-health-overview',
    imports: [DecimalPipe],
    templateUrl: './watchlist-health-overview.html',
    styleUrl: './watchlist-health-overview.css',
})
export class WatchlistHealthOverview {
    @Input({ required: true }) items: readonly WatchlistItem[] = [];

    get summary(): WatchlistHealthSummary {
        const languages = this.items
            .map((item) => this.getTextMetric(item, 'language'))
            .filter((language) => language !== 'N/A');

        const languageCounts = new Map<string, number>();

        for (const language of languages) {
            languageCounts.set(language, (languageCounts.get(language) ?? 0) + 1);
        }

        const topLanguages = [...languageCounts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([language]) => language);

        return {
            total: this.items.length,
            archived: this.items.filter((item) => this.getBooleanMetric(item, 'isArchived')).length,
            highAdoption: this.items.filter((item) => this.getNumberMetric(item, 'stars') >= 10000).length,
            highIssueLoad: this.items.filter((item) => this.hasHighIssueLoad(item)).length,
            topLanguages,
        };
    }

    getNumberMetric(item: WatchlistItem, key: string): number {
        const value = item.metadata?.[key];

        return typeof value === 'number' ? value : 0;
    }

    getTextMetric(item: WatchlistItem, key: string): string {
        const value = item.metadata?.[key];

        return typeof value === 'string' && value.trim() ? value : 'N/A';
    }

    private getBooleanMetric(item: WatchlistItem, key: string): boolean {
        const value = item.metadata?.[key];

        return typeof value === 'boolean' ? value : false;
    }

    private hasHighIssueLoad(item: WatchlistItem): boolean {
        const stars = this.getNumberMetric(item, 'stars');
        const openIssues = this.getNumberMetric(item, 'openIssues');

        if (stars <= 0 || openIssues <= 0) {
            return false;
        }

        return openIssues / stars > 0.05;
    }
}