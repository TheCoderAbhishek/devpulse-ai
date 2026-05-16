export interface GithubReadme {
    readonly name: string;
    readonly path: string;
    readonly sha: string;
    readonly size: number;
    readonly htmlUrl: string;
    readonly downloadUrl?: string;
    readonly type: string;
    readonly encoding: string;
    readonly contentPreview?: string;
}