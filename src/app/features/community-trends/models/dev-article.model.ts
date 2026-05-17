export interface DevArticleAuthor {
    readonly name?: string;
    readonly username?: string;
    readonly profileImage?: string;
    readonly profileUrl?: string;
    readonly githubUsername?: string;
    readonly websiteUrl?: string;
}

export interface DevArticle {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly url: string;
    readonly publishedAt: string;
    readonly lastCommentAt: string;
    readonly commentsCount: number;
    readonly reactionsCount: number;
    readonly readingTimeMinutes: number;
    readonly tags: readonly string[];
    readonly coverImage?: string;
    readonly author: DevArticleAuthor;
}