export interface GithubRepositoryOwner {
    readonly id: string;
    readonly username: string;
    readonly avatarUrl: string;
    readonly profileUrl: string;
    readonly type: string;
}

export interface GithubRepositoryLicense {
    readonly key: string;
    readonly name: string;
    readonly spdxId?: string;
    readonly url?: string;
}

export interface GithubRepository {
    readonly id: string;
    readonly nodeId: string;
    readonly name: string;
    readonly fullName: string;
    readonly description?: string;
    readonly url: string;
    readonly apiUrl: string;
    readonly owner: GithubRepositoryOwner;
    readonly stars: number;
    readonly watchers: number;
    readonly forks: number;
    readonly openIssues: number;
    readonly language?: string;
    readonly topics: readonly string[];
    readonly license?: GithubRepositoryLicense;
    readonly homepage?: string;
    readonly defaultBranch: string;
    readonly sizeKb: number;
    readonly isFork: boolean;
    readonly isArchived: boolean;
    readonly isDisabled: boolean;
    readonly visibility: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly pushedAt?: string;
    readonly searchScore?: number;
}