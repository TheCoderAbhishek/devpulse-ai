export interface GithubContributor {
    readonly id: string;
    readonly username: string;
    readonly avatarUrl: string;
    readonly profileUrl: string;
    readonly type: string;
    readonly contributions: number;
}