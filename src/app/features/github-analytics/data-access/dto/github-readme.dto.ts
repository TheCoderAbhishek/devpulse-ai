export interface GithubReadmeDto {
    readonly name: string;
    readonly path: string;
    readonly sha: string;
    readonly size: number;
    readonly html_url: string;
    readonly download_url: string | null;
    readonly type: string;
    readonly encoding: string;
    readonly content: string;
}