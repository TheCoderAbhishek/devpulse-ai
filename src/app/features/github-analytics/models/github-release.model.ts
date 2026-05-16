export interface GithubRelease {
    readonly id: string;
    readonly tagName: string;
    readonly name?: string;
    readonly url: string;
    readonly isDraft: boolean;
    readonly isPrerelease: boolean;
    readonly createdAt: string;
    readonly publishedAt?: string;
    readonly body?: string;
}