export interface HackerNewsStory {
    readonly id: string;
    readonly title: string;
    readonly url?: string;
    readonly hackerNewsUrl: string;
    readonly author?: string;
    readonly score: number;
    readonly commentCount: number;
    readonly createdAt?: string;
    readonly matchedKeywords: readonly string[];
}