import { TestBed } from '@angular/core/testing';

import { DevArticle } from '../../models/dev-article.model';
import { HackerNewsStory } from '../../models/hacker-news-story.model';
import { CommunityTrendAnalyzerService } from './community-trend-analyzer.service';

describe('CommunityTrendAnalyzerService', () => {
    let service: CommunityTrendAnalyzerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CommunityTrendAnalyzerService);
    });

    it('should build balanced community trend signals', () => {
        const devArticles: DevArticle[] = [
            createDevArticle('1', ['angular', 'rxjs'], 100, 10),
            createDevArticle('2', ['angular'], 120, 5),
        ];

        const hackerNewsStories: HackerNewsStory[] = [
            {
                id: '1',
                title: 'Angular Signals discussion',
                hackerNewsUrl: 'https://news.ycombinator.com/item?id=1',
                score: 150,
                commentCount: 30,
                matchedKeywords: ['angular'],
            },
        ];

        const result = service.buildSignals(
            {
                keywords: ['angular', 'rxjs'],
                sourceContext: 'angular/angular',
            },
            devArticles,
            hackerNewsStories,
        );

        expect(result.summary.devArticleCount).toBe(2);
        expect(result.summary.hackerNewsStoryCount).toBe(1);
        expect(result.summary.totalDevReactions).toBe(220);
        expect(result.summary.totalHackerNewsScore).toBe(150);
        expect(result.insights.length).toBeGreaterThan(0);
    });

    it('should return limited signal insight when no content exists', () => {
        const result = service.buildSignals(
            {
                keywords: ['unknown-topic'],
            },
            [],
            [],
        );

        expect(result.summary.strongestSignal).toBe('none');
        expect(result.insights[0].title).toBe('Limited Community Signal');
    });

    function createDevArticle(
        id: string,
        tags: readonly string[],
        reactions: number,
        comments: number,
    ): DevArticle {
        return {
            id,
            title: `Article ${id}`,
            description: 'Demo article',
            url: `https://dev.to/demo/${id}`,
            publishedAt: new Date().toISOString(),
            lastCommentAt: new Date().toISOString(),
            commentsCount: comments,
            reactionsCount: reactions,
            readingTimeMinutes: 5,
            tags,
            author: {
                username: 'demo',
            },
        };
    }
});