import { DevArticle } from './dev-article.model';
import { HackerNewsStory } from './hacker-news-story.model';

export interface CommunityTrendSignalParams {
    readonly keywords: readonly string[];
    readonly sourceContext?: string;
}

export interface CommunityTrendSummary {
    readonly devArticleCount: number;
    readonly hackerNewsStoryCount: number;
    readonly totalDevReactions: number;
    readonly totalDevComments: number;
    readonly totalHackerNewsScore: number;
    readonly totalHackerNewsComments: number;
    readonly strongestSignal: 'dev' | 'hackerNews' | 'balanced' | 'none';
    readonly topKeywords: readonly string[];
}

export interface CommunityTrendInsight {
    readonly title: string;
    readonly description: string;
    readonly severity: 'low' | 'medium' | 'high';
}

export interface CommunityTrendSignals {
    readonly params: CommunityTrendSignalParams;
    readonly devArticles: readonly DevArticle[];
    readonly hackerNewsStories: readonly HackerNewsStory[];
    readonly summary: CommunityTrendSummary;
    readonly insights: readonly CommunityTrendInsight[];
    readonly loadedAt: string;
}