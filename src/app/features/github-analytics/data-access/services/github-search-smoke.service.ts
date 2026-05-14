import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CachedDataState } from '../../../../core/cache/models/cached-data-state.model';
import { GithubRepositoryRepository } from '../repositories/github-repository.repository';
import { GithubRepositorySearchResult } from '../../models/github-repository-search-result.model';

@Injectable({
    providedIn: 'root',
})
export class GithubSearchSmokeService {
    private readonly githubRepositoryRepository = inject(
        GithubRepositoryRepository,
    );

    run(): Observable<CachedDataState<GithubRepositorySearchResult>> {
        return this.githubRepositoryRepository.searchRepositories({
            query: 'angular rxjs',
            language: 'TypeScript',
            minStars: 1000,
            includeForks: false,
            sort: 'stars',
            order: 'desc',
            page: 1,
            perPage: 10,
        });
    }
}