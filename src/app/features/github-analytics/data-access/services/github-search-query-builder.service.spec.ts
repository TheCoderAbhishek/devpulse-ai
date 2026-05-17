import { TestBed } from '@angular/core/testing';

import { GithubSearchQueryBuilderService } from './github-search-query-builder.service';

describe('GithubSearchQueryBuilderService', () => {
    let service: GithubSearchQueryBuilderService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GithubSearchQueryBuilderService);
    });

    it('should build query with text, language, stars, and fork filter', () => {
        const query = service.build({
            query: 'angular rxjs',
            language: 'TypeScript',
            minStars: 1000,
            includeForks: false,
        });

        expect(query).toContain('angular rxjs in:name,description,readme');
        expect(query).toContain('language:TypeScript');
        expect(query).toContain('stars:>=1000');
        expect(query).toContain('fork:false');
    });

    it('should include topic qualifier when topic is provided', () => {
        const query = service.build({
            query: 'signals',
            topic: 'angular',
        });

        expect(query).toContain('topic:angular');
    });

    it('should fallback to default popular repositories query when empty', () => {
        const query = service.build({
            query: '',
        });

        expect(query).toBe('stars:>=1000 fork:false');
    });

    it('should sanitize unsafe characters from free text', () => {
        const query = service.build({
            query: 'angular<script>alert(1)</script>',
        });

        expect(query).not.toContain('<script>');
        expect(query).toContain('angular');
    });
});