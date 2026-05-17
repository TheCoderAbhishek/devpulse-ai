import { Injectable } from '@angular/core';

import { GithubRepository } from '../../../github-analytics/models/github-repository.model';

@Injectable({
    providedIn: 'root',
})
export class CommunityKeywordBuilderService {
    fromRepository(repository: GithubRepository): readonly string[] {
        const candidates = [
            repository.name,
            repository.language,
            ...repository.topics,
        ]
            .filter((value): value is string => Boolean(value))
            .map((value) => this.normalize(value))
            .filter((value): value is string => Boolean(value));

        return [...new Set(candidates)].slice(0, 6);
    }

    normalize(value: string): string | null {
        const normalized = value
            .trim()
            .toLowerCase()
            .replace(/^js$/, 'javascript')
            .replace(/^ts$/, 'typescript')
            .replace(/\s+/g, '-')
            .replace(/_/g, '-')
            .replace(/[^a-z0-9+#.-]/g, '');

        return normalized || null;
    }

    toReadableQuery(keywords: readonly string[]): string {
        return keywords.slice(0, 3).join(' ');
    }
}