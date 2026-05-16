import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { GithubRepository } from '../../models/github-repository.model';
import { GithubRepositoryDetailStore } from '../../stores/github-repository-detail.store';
import { GithubWatchlistService } from '../../data-access/services/github-watchlist.service';
import { RepositoryHealthCard } from '../../components/repository-health-card/repository-health-card';
import { StackOverflowInsightsCard } from '../../../stackoverflow-insights/components/stackoverflow-insights-card/stackoverflow-insights-card';
import { CommunityTrendSignalsCard } from '../../../community-trends/components/community-trend-signals-card/community-trend-signals-card';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
    selector: 'app-repository-detail',
    imports: [
        AsyncPipe,
        DatePipe,
        DecimalPipe,
        RouterLink,
        RepositoryHealthCard,
        StackOverflowInsightsCard,
        CommunityTrendSignalsCard,
    ],
    providers: [GithubRepositoryDetailStore],
    templateUrl: './repository-detail.html',
    styleUrl: './repository-detail.css',
})
export class RepositoryDetail {
    private readonly route = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly githubWatchlistService = inject(GithubWatchlistService);
    private readonly toastService = inject(ToastService);

    readonly store = inject(GithubRepositoryDetailStore);
    readonly vm$ = this.store.vm$;
    readonly savedRepositoryExternalIds$ =
        this.githubWatchlistService.savedRepositoryExternalIds$;

    private owner = '';
    private repo = '';

    constructor() {
        this.route.paramMap
            .pipe(
                map((params) => ({
                    owner: params.get('owner') ?? '',
                    repo: params.get('repo') ?? '',
                })),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(({ owner, repo }) => {
                this.owner = owner;
                this.repo = repo;

                if (owner && repo) {
                    this.store.loadRepository(owner, repo);
                }
            });
    }

    onRefresh(): void {
        if (!this.owner || !this.repo) {
            return;
        }

        this.store.loadRepository(this.owner, this.repo, true);
    }

    onSaveRepository(repository: GithubRepository): void {
        this.githubWatchlistService.saveRepository(repository).subscribe({
            next: () => {
                this.toastService.success(
                    'Repository saved',
                    `${repository.fullName} was added to your watchlist.`,
                );
            },
            error: () => {
                this.toastService.error(
                    'Save failed',
                    'Unable to save repository to the watchlist.',
                );
            },
        });
    }

    onRemoveRepository(repository: GithubRepository): void {
        this.githubWatchlistService.removeRepository(repository).subscribe({
            next: () => {
                this.toastService.info(
                    'Repository removed',
                    `${repository.fullName} was removed from your watchlist.`,
                );
            },
            error: () => {
                this.toastService.error(
                    'Remove failed',
                    'Unable to remove repository from the watchlist.',
                );
            },
        });
    }

    isRepositorySaved(
        repository: GithubRepository,
        savedRepositoryExternalIds: ReadonlySet<string>,
    ): boolean {
        return savedRepositoryExternalIds.has(repository.fullName.toLowerCase());
    }

    getErrorMessage(error: unknown): string {
        if (
            error &&
            typeof error === 'object' &&
            'message' in error &&
            typeof error.message === 'string'
        ) {
            return error.message;
        }

        return 'Unable to load repository detail.';
    }
}