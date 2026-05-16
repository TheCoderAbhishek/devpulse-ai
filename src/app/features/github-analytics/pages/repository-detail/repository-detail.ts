import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { GithubRepository } from '../../models/github-repository.model';
import { GithubRepositoryDetailStore } from '../../stores/github-repository-detail.store';
import { GithubWatchlistService } from '../../data-access/services/github-watchlist.service';

@Component({
    selector: 'app-repository-detail',
    imports: [AsyncPipe, DatePipe, DecimalPipe, RouterLink],
    providers: [GithubRepositoryDetailStore],
    templateUrl: './repository-detail.html',
    styleUrl: './repository-detail.css',
})
export class RepositoryDetail {
    private readonly route = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly githubWatchlistService = inject(GithubWatchlistService);

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
        this.githubWatchlistService.saveRepository(repository).subscribe();
    }

    onRemoveRepository(repository: GithubRepository): void {
        this.githubWatchlistService.removeRepository(repository).subscribe();
    }

    isRepositorySaved(
        repository: GithubRepository,
        savedRepositoryExternalIds: ReadonlySet<string>,
    ): boolean {
        return savedRepositoryExternalIds.has(repository.fullName.toLowerCase());
    }

    getHealthClass(level: string): string {
        switch (level) {
            case 'excellent':
                return 'border-emerald-700 bg-emerald-950 text-emerald-200';
            case 'good':
                return 'border-blue-700 bg-blue-950 text-blue-200';
            case 'moderate':
                return 'border-amber-700 bg-amber-950 text-amber-200';
            default:
                return 'border-red-700 bg-red-950 text-red-200';
        }
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