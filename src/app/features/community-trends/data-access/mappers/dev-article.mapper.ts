import { Injectable } from '@angular/core';

import { DevArticleDto } from '../dto/dev-article.dto';
import { DevArticle } from '../../models/dev-article.model';

@Injectable({
    providedIn: 'root',
})
export class DevArticleMapper {
    toArticle(dto: DevArticleDto): DevArticle {
        return {
            id: String(dto.id),
            title: dto.title,
            description: dto.description,
            url: dto.url,
            publishedAt: dto.published_at,
            lastCommentAt: dto.last_comment_at,
            commentsCount: dto.comments_count,
            reactionsCount:
                dto.positive_reactions_count ?? dto.public_reactions_count ?? 0,
            readingTimeMinutes: dto.reading_time_minutes,
            tags: dto.tag_list ?? [],
            coverImage: dto.cover_image ?? dto.social_image,
            author: {
                name: dto.user?.name,
                username: dto.user?.username,
                profileImage: dto.user?.profile_image_90 ?? dto.user?.profile_image,
                profileUrl: dto.user?.username
                    ? `https://dev.to/${dto.user.username}`
                    : undefined,
                githubUsername: dto.user?.github_username ?? undefined,
                websiteUrl: dto.user?.website_url ?? undefined,
            },
        };
    }
}