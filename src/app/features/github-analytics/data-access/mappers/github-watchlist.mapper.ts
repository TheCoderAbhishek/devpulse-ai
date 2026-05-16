import { Injectable } from '@angular/core';

import { WatchlistItem } from '../../../../core/storage/models/watchlist-item.model';
import { GithubRepository } from '../../models/github-repository.model';

@Injectable({
    providedIn: 'root',
})
export class GithubWatchlistMapper {
    toWatchlistItem(repository: GithubRepository): WatchlistItem {
        const now = new Date().toISOString();

        return {
            id: this.toWatchlistId(repository),
            type: 'repository',
            provider: 'github',
            externalId: this.toExternalId(repository),
            title: repository.fullName,
            subtitle: repository.description,
            url: repository.url,
            tags: this.toTags(repository),
            metadata: {
                owner: repository.owner.username,
                name: repository.name,
                fullName: repository.fullName,
                language: repository.language,
                stars: repository.stars,
                forks: repository.forks,
                openIssues: repository.openIssues,
                watchers: repository.watchers,
                defaultBranch: repository.defaultBranch,
                license: repository.license?.name,
                homepage: repository.homepage,
                isFork: repository.isFork,
                isArchived: repository.isArchived,
                isDisabled: repository.isDisabled,
                createdAt: repository.createdAt,
                updatedAt: repository.updatedAt,
                pushedAt: repository.pushedAt,
            },
            createdAt: now,
            updatedAt: now,
            lastSyncedAt: now,
        };
    }

    toWatchlistId(repository: GithubRepository): string {
        return `github:repository:${this.toExternalId(repository)}`;
    }

    toExternalId(repository: GithubRepository): string {
        return repository.fullName.toLowerCase();
    }

    private toTags(repository: GithubRepository): readonly string[] {
        const tags = [
            repository.language,
            ...repository.topics,
        ]
            .filter((tag): tag is string => Boolean(tag))
            .map((tag) => tag.toLowerCase());

        return [...new Set(tags)];
    }
}