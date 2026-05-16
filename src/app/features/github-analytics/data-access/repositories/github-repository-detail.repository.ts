import { Injectable, inject } from '@angular/core';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';

import { ApiClientService } from '../../../../core/api/services/api-client.service';
import { CacheKeyBuilder } from '../../../../core/cache/utils/cache-key.builder';
import { CachedDataState } from '../../../../core/cache/models/cached-data-state.model';
import { LONG_LIVED_CACHE_POLICY } from '../../../../core/cache/models/cache-policy.model';
import { StaleWhileRevalidateService } from '../../../../core/cache/services/stale-while-revalidate.service';

import { GithubContributorDto } from '../dto/github-contributor.dto';
import { GithubReadmeDto } from '../dto/github-readme.dto';
import { GithubReleaseDto } from '../dto/github-release.dto';
import { GithubRepositoryDto } from '../dto/github-repository.dto';
import { GithubRepositoryDetail } from '../../models/github-repository-detail.model';
import { GithubRepositoryMapper } from '../mappers/github-repository.mapper';
import { GithubRepositoryHealthCalculatorService } from '../services/github-repository-health-calculator.service';

export interface GithubRepositoryDetailParams {
    readonly owner: string;
    readonly repo: string;
    readonly forceRefresh?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class GithubRepositoryDetailRepository {
    private readonly apiClient = inject(ApiClientService);
    private readonly mapper = inject(GithubRepositoryMapper);
    private readonly healthCalculator = inject(GithubRepositoryHealthCalculatorService);
    private readonly staleWhileRevalidate = inject(StaleWhileRevalidateService);

    getRepositoryDetail(
        params: GithubRepositoryDetailParams,
    ): Observable<CachedDataState<GithubRepositoryDetail>> {
        const normalizedOwner = params.owner.trim();
        const normalizedRepo = params.repo.trim();

        const cacheKey = CacheKeyBuilder.build({
            provider: 'github',
            resource: 'repository-detail',
            params: {
                owner: normalizedOwner.toLowerCase(),
                repo: normalizedRepo.toLowerCase(),
            },
        });

        return this.staleWhileRevalidate.load<GithubRepositoryDetail>({
            cacheKey,
            provider: 'github',
            resource: 'repository-detail',
            ttlSeconds: LONG_LIVED_CACHE_POLICY.ttlSeconds,
            forceRefresh: params.forceRefresh ?? false,
            fetcher: () =>
                this.fetchRepositoryDetail(normalizedOwner, normalizedRepo),
        });
    }

    private fetchRepositoryDetail(
        owner: string,
        repo: string,
    ): Observable<GithubRepositoryDetail> {
        const encodedOwner = encodeURIComponent(owner);
        const encodedRepo = encodeURIComponent(repo);

        const repository$ = this.apiClient.get<GithubRepositoryDto>(
            'github',
            `/repos/${encodedOwner}/${encodedRepo}`,
            {
                headers: {
                    Accept: 'application/vnd.github+json',
                },
            },
        );

        const readme$ = this.apiClient
            .get<GithubReadmeDto>(
                'github',
                `/repos/${encodedOwner}/${encodedRepo}/readme`,
                {
                    headers: {
                        Accept: 'application/vnd.github+json',
                    },
                },
            )
            .pipe(catchError(() => of(undefined)));

        const releases$ = this.apiClient
            .get<readonly GithubReleaseDto[]>(
                'github',
                `/repos/${encodedOwner}/${encodedRepo}/releases`,
                {
                    params: {
                        per_page: 5,
                    },
                    headers: {
                        Accept: 'application/vnd.github+json',
                    },
                },
            )
            .pipe(catchError(() => of([])));

        const contributors$ = this.apiClient
            .get<readonly GithubContributorDto[]>(
                'github',
                `/repos/${encodedOwner}/${encodedRepo}/contributors`,
                {
                    params: {
                        per_page: 12,
                    },
                    headers: {
                        Accept: 'application/vnd.github+json',
                    },
                },
            )
            .pipe(catchError(() => of([])));

        return forkJoin({
            repository: repository$,
            readme: readme$,
            releases: releases$,
            contributors: contributors$,
        }).pipe(
            map(({ repository, readme, releases, contributors }) => {
                const mappedRepository = this.mapper.toRepository(repository);
                const mappedReleases = releases.map((release) =>
                    this.mapper.toRelease(release),
                );
                const mappedContributors = contributors.map((contributor) =>
                    this.mapper.toContributor(contributor),
                );

                return {
                    repository: mappedRepository,
                    readme: readme ? this.mapper.toReadme(readme) : undefined,
                    releases: mappedReleases,
                    contributors: mappedContributors,
                    health: this.healthCalculator.calculate(
                        mappedRepository,
                        mappedContributors,
                        mappedReleases,
                    ),
                    loadedAt: new Date().toISOString(),
                };
            }),
        );
    }
}