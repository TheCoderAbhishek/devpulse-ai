import { GithubRepositoryDto } from './github-repository.dto';

export interface GithubSearchResponseDto {
    readonly total_count: number;
    readonly incomplete_results: boolean;
    readonly items: readonly GithubRepositoryDto[];
}