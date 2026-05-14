export interface GithubOwnerDto {
    readonly id: number;
    readonly login: string;
    readonly avatar_url: string;
    readonly html_url: string;
    readonly type: string;
}

export interface GithubLicenseDto {
    readonly key: string;
    readonly name: string;
    readonly spdx_id: string | null;
    readonly url: string | null;
}

export interface GithubRepositoryDto {
    readonly id: number;
    readonly node_id: string;
    readonly name: string;
    readonly full_name: string;
    readonly private: boolean;
    readonly owner: GithubOwnerDto;
    readonly html_url: string;
    readonly description: string | null;
    readonly fork: boolean;
    readonly url: string;
    readonly created_at: string;
    readonly updated_at: string;
    readonly pushed_at: string | null;
    readonly homepage: string | null;
    readonly size: number;
    readonly stargazers_count: number;
    readonly watchers_count: number;
    readonly language: string | null;
    readonly forks_count: number;
    readonly open_issues_count: number;
    readonly default_branch: string;
    readonly score?: number;
    readonly topics?: readonly string[];
    readonly license?: GithubLicenseDto | null;
    readonly archived: boolean;
    readonly disabled: boolean;
    readonly visibility: string;
}