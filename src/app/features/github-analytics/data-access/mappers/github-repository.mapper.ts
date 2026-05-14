import { Injectable } from '@angular/core';

import { GithubRepositoryDto } from '../dto/github-repository.dto';
import { GithubSearchResponseDto } from '../dto/github-search-response.dto';
import { GithubRepository } from '../../models/github-repository.model';
import { GithubRepositorySearchParams } from '../../models/github-repository-search-params.model';
import { GithubRepositorySearchResult } from '../../models/github-repository-search-result.model';

@Injectable({
    providedIn: 'root',
})
export class GithubRepositoryMapper {
    toRepository(dto: GithubRepositoryDto): GithubRepository {
        return {
            id: String(dto.id),
            nodeId: dto.node_id,
            name: dto.name,
            fullName: dto.full_name,
            description: dto.description ?? undefined,
            url: dto.html_url,
            apiUrl: dto.url,
            owner: {
                id: String(dto.owner.id),
                username: dto.owner.login,
                avatarUrl: dto.owner.avatar_url,
                profileUrl: dto.owner.html_url,
                type: dto.owner.type,
            },
            stars: dto.stargazers_count,
            watchers: dto.watchers_count,
            forks: dto.forks_count,
            openIssues: dto.open_issues_count,
            language: dto.language ?? undefined,
            topics: dto.topics ?? [],
            license: dto.license
                ? {
                    key: dto.license.key,
                    name: dto.license.name,
                    spdxId: dto.license.spdx_id ?? undefined,
                    url: dto.license.url ?? undefined,
                }
                : undefined,
            homepage: dto.homepage ?? undefined,
            defaultBranch: dto.default_branch,
            sizeKb: dto.size,
            isFork: dto.fork,
            isArchived: dto.archived,
            isDisabled: dto.disabled,
            visibility: dto.visibility,
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
            pushedAt: dto.pushed_at ?? undefined,
            searchScore: dto.score,
        };
    }

    toSearchResult(
        dto: GithubSearchResponseDto,
        params: GithubRepositorySearchParams,
        builtQuery: string,
    ): GithubRepositorySearchResult {
        return {
            totalCount: dto.total_count,
            incompleteResults: dto.incomplete_results,
            repositories: dto.items.map((item) => this.toRepository(item)),
            page: params.page ?? 1,
            perPage: params.perPage ?? 10,
            query: builtQuery,
            params,
        };
    }
}