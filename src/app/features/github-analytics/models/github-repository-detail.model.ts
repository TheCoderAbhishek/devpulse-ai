import { GithubContributor } from './github-contributor.model';
import { GithubReadme } from './github-readme.model';
import { GithubRelease } from './github-release.model';
import { GithubRepositoryHealth } from './github-repository-health.model';
import { GithubRepository } from './github-repository.model';

export interface GithubRepositoryDetail {
    readonly repository: GithubRepository;
    readonly readme?: GithubReadme;
    readonly releases: readonly GithubRelease[];
    readonly contributors: readonly GithubContributor[];
    readonly health: GithubRepositoryHealth;
    readonly loadedAt: string;
}