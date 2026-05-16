export interface GithubContributorDto {
    readonly id: number;
    readonly login: string;
    readonly avatar_url: string;
    readonly html_url: string;
    readonly type: string;
    readonly contributions: number;
}