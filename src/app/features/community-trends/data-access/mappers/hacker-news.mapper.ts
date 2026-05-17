import { Injectable } from '@angular/core';

import { HackerNewsItemDto } from '../dto/hacker-news-item.dto';
import { HackerNewsStory } from '../../models/hacker-news-story.model';

@Injectable({
    providedIn: 'root',
})
export class HackerNewsMapper {
    toStory(
        dto: HackerNewsItemDto,
        keywords: readonly string[],
    ): HackerNewsStory | null {
        if (!dto.title || dto.type !== 'story' || dto.deleted || dto.dead) {
            return null;
        }

        const normalizedTitle = dto.title.toLowerCase();
        const normalizedUrl = dto.url?.toLowerCase() ?? '';

        const matchedKeywords = keywords.filter((keyword) => {
            const normalizedKeyword = keyword.toLowerCase();

            return (
                normalizedTitle.includes(normalizedKeyword) ||
                normalizedUrl.includes(normalizedKeyword)
            );
        });

        if (matchedKeywords.length === 0) {
            return null;
        }

        return {
            id: String(dto.id),
            title: dto.title,
            url: dto.url,
            hackerNewsUrl: `https://news.ycombinator.com/item?id=${dto.id}`,
            author: dto.by,
            score: dto.score ?? 0,
            commentCount: dto.descendants ?? 0,
            createdAt: dto.time ? new Date(dto.time * 1000).toISOString() : undefined,
            matchedKeywords,
        };
    }
}