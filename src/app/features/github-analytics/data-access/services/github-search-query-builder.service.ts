import { Injectable } from '@angular/core';

import { GithubRepositorySearchParams } from '../../models/github-repository-search-params.model';

@Injectable({
    providedIn: 'root',
})
export class GithubSearchQueryBuilderService {
    build(params: GithubRepositorySearchParams): string {
        const tokens: string[] = [];

        const safeQuery = this.sanitizeFreeText(params.query);

        if (safeQuery) {
            tokens.push(`${safeQuery} in:name,description,readme`);
        }

        if (params.language) {
            tokens.push(`language:${this.sanitizeQualifier(params.language)}`);
        }

        if (params.topic) {
            tokens.push(`topic:${this.sanitizeQualifier(params.topic)}`);
        }

        if (typeof params.minStars === 'number' && params.minStars > 0) {
            tokens.push(`stars:>=${params.minStars}`);
        }

        if (params.pushedAfter) {
            tokens.push(`pushed:>=${params.pushedAfter}`);
        }

        if (params.createdAfter) {
            tokens.push(`created:>=${params.createdAfter}`);
        }

        if (params.includeForks === false) {
            tokens.push('fork:false');
        }

        const query = tokens.join(' ').trim();

        if (!query) {
            return 'stars:>=1000 fork:false';
        }

        return query;
    }

    private sanitizeFreeText(value: string): string {
        return value
            .trim()
            .replace(/[^\w\s.-]/g, ' ')
            .replace(/\s+/g, ' ')
            .slice(0, 120);
    }

    private sanitizeQualifier(value: string): string {
        return value.trim().replace(/[^\w.-]/g, '').slice(0, 60);
    }
}