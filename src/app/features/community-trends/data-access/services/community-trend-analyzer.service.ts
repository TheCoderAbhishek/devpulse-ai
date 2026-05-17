import { Injectable } from '@angular/core';

import {
    CommunityTrendInsight,
    CommunityTrendSignals,
    CommunityTrendSignalParams,
    CommunityTrendSummary,
} from '../../models/community-trend-signals.model';
import { DevArticle } from '../../models/dev-article.model';
import { HackerNewsStory } from '../../models/hacker-news-story.model';

@Injectable({
    providedIn: 'root',
})
export class CommunityTrendAnalyzerService {
    buildSignals(
        params: CommunityTrendSignalParams,
        devArticles: readonly DevArticle[],
        hackerNewsStories: readonly HackerNewsStory[],
    ): CommunityTrendSignals {
        const summary = this.buildSummary(params, devArticles, hackerNewsStories);

        return {
            params,
            devArticles,
            hackerNewsStories,
            summary,
            insights: this.buildInsights(summary),
            loadedAt: new Date().toISOString(),
        };
    }

    private buildSummary(
        params: CommunityTrendSignalParams,
        devArticles: readonly DevArticle[],
        hackerNewsStories: readonly HackerNewsStory[],
    ): CommunityTrendSummary {
        const totalDevReactions = devArticles.reduce(
            (sum, article) => sum + article.reactionsCount,
            0,
        );

        const totalDevComments = devArticles.reduce(
            (sum, article) => sum + article.commentsCount,
            0,
        );

        const totalHackerNewsScore = hackerNewsStories.reduce(
            (sum, story) => sum + story.score,
            0,
        );

        const totalHackerNewsComments = hackerNewsStories.reduce(
            (sum, story) => sum + story.commentCount,
            0,
        );

        return {
            devArticleCount: devArticles.length,
            hackerNewsStoryCount: hackerNewsStories.length,
            totalDevReactions,
            totalDevComments,
            totalHackerNewsScore,
            totalHackerNewsComments,
            strongestSignal: this.getStrongestSignal(
                devArticles.length,
                hackerNewsStories.length,
                totalDevReactions,
                totalHackerNewsScore,
            ),
            topKeywords: this.getTopKeywords(params, devArticles, hackerNewsStories),
        };
    }

    private buildInsights(
        summary: CommunityTrendSummary,
    ): readonly CommunityTrendInsight[] {
        const insights: CommunityTrendInsight[] = [];

        if (
            summary.devArticleCount === 0 &&
            summary.hackerNewsStoryCount === 0
        ) {
            return [
                {
                    title: 'Limited Community Signal',
                    description:
                        'No strong DEV or Hacker News signal was found for the selected keywords.',
                    severity: 'medium',
                },
            ];
        }

        if (summary.devArticleCount >= 5) {
            insights.push({
                title: 'Strong DEV Content Activity',
                description:
                    'Multiple DEV articles were found, indicating active educational or community content.',
                severity: 'low',
            });
        }

        if (summary.hackerNewsStoryCount >= 3) {
            insights.push({
                title: 'Visible Hacker News Discussion',
                description:
                    'Related Hacker News stories were found among recent/top stories.',
                severity: 'low',
            });
        }

        if (summary.totalHackerNewsComments >= 100) {
            insights.push({
                title: 'High Discussion Volume',
                description:
                    'Hacker News comments indicate notable community debate or interest.',
                severity: 'medium',
            });
        }

        if (summary.totalDevReactions >= 500) {
            insights.push({
                title: 'High DEV Engagement',
                description:
                    'DEV reactions indicate strong public engagement around related topics.',
                severity: 'low',
            });
        }

        if (insights.length === 0) {
            insights.push({
                title: 'Moderate Community Activity',
                description:
                    'Some community content exists, but signal strength is currently moderate.',
                severity: 'medium',
            });
        }

        return insights;
    }

    private getStrongestSignal(
        devArticleCount: number,
        hackerNewsStoryCount: number,
        totalDevReactions: number,
        totalHackerNewsScore: number,
    ): CommunityTrendSummary['strongestSignal'] {
        if (devArticleCount === 0 && hackerNewsStoryCount === 0) {
            return 'none';
        }

        const devStrength = devArticleCount * 10 + totalDevReactions;
        const hnStrength = hackerNewsStoryCount * 20 + totalHackerNewsScore;

        if (Math.abs(devStrength - hnStrength) <= 50) {
            return 'balanced';
        }

        return devStrength > hnStrength ? 'dev' : 'hackerNews';
    }

    private getTopKeywords(
        params: CommunityTrendSignalParams,
        devArticles: readonly DevArticle[],
        hackerNewsStories: readonly HackerNewsStory[],
    ): readonly string[] {
        const counts = new Map<string, number>();

        for (const keyword of params.keywords) {
            counts.set(keyword, 0);
        }

        for (const article of devArticles) {
            for (const tag of article.tags) {
                const normalizedTag = tag.toLowerCase();
                counts.set(normalizedTag, (counts.get(normalizedTag) ?? 0) + 1);
            }
        }

        for (const story of hackerNewsStories) {
            for (const keyword of story.matchedKeywords) {
                counts.set(keyword, (counts.get(keyword) ?? 0) + 1);
            }
        }

        return [...counts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([keyword]) => keyword);
    }
}