export interface GithubReleaseDto {
    readonly id: number;
    readonly tag_name: string;
    readonly name: string | null;
    readonly html_url: string;
    readonly draft: boolean;
    readonly prerelease: boolean;
    readonly created_at: string;
    readonly published_at: string | null;
    readonly body: string | null;
}