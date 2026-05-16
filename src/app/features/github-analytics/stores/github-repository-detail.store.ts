import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, of, startWith, Subject, switchMap } from 'rxjs';

import { CachedDataState } from '../../../core/cache/models/cached-data-state.model';
import {
    GithubRepositoryDetailParams,
    GithubRepositoryDetailRepository,
} from '../data-access/repositories/github-repository-detail.repository';
import { GithubRepositoryDetail } from '../models/github-repository-detail.model';
import { GithubRepositoryDetailViewState } from '../models/github-repository-detail-view-state.model';

@Injectable()
export class GithubRepositoryDetailStore {
    private readonly detailRepository = inject(GithubRepositoryDetailRepository);
    private readonly loadTrigger = new Subject<GithubRepositoryDetailParams>();

    readonly vm$: Observable<GithubRepositoryDetailViewState> =
        this.loadTrigger.pipe(
            switchMap((params) => this.load(params)),
        );

    loadRepository(owner: string, repo: string, forceRefresh = false): void {
        this.loadTrigger.next({
            owner,
            repo,
            forceRefresh,
        });
    }

    private load(
        params: GithubRepositoryDetailParams,
    ): Observable<GithubRepositoryDetailViewState> {
        return this.detailRepository.getRepositoryDetail(params).pipe(
            map((state) => this.toViewState(state, params)),
            startWith({
                status: 'loading',
                owner: params.owner,
                repo: params.repo,
            } satisfies GithubRepositoryDetailViewState),
            catchError((error: unknown) =>
                of({
                    status: 'error',
                    owner: params.owner,
                    repo: params.repo,
                    error,
                } satisfies GithubRepositoryDetailViewState),
            ),
        );
    }

    private toViewState(
        state: CachedDataState<GithubRepositoryDetail>,
        params: GithubRepositoryDetailParams,
    ): GithubRepositoryDetailViewState {
        if (state.status === 'success') {
            return {
                status: 'success',
                owner: params.owner,
                repo: params.repo,
                detail: state.data,
                source: state.source,
                stale: state.stale,
                cachedAt: state.cachedAt,
            };
        }

        if (state.status === 'error') {
            return {
                status: 'error',
                owner: params.owner,
                repo: params.repo,
                error: state.error,
                cachedData: state.cachedData,
                stale: state.stale,
            };
        }

        return {
            status: 'loading',
            owner: params.owner,
            repo: params.repo,
        };
    }
}