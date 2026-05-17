import { CacheKeyBuilder } from './cache-key.builder';

describe('CacheKeyBuilder', () => {
    it('should build a stable cache key without params', () => {
        const key = CacheKeyBuilder.build({
            provider: 'github',
            resource: 'repository-search',
        });

        expect(key).toBe('github:repository-search:no-params');
    });

    it('should sort params alphabetically for stable cache keys', () => {
        const key = CacheKeyBuilder.build({
            provider: 'github',
            resource: 'repository-search',
            params: {
                sort: 'stars',
                query: 'angular',
                page: 1,
            },
        });

        expect(key).toBe('github:repository-search:page=1&query=angular&sort=stars');
    });

    it('should normalize array params by sorting values', () => {
        const key = CacheKeyBuilder.build({
            provider: 'stackExchange',
            resource: 'stackoverflow-insights',
            params: {
                tags: ['rxjs', 'angular', 'typescript'],
            },
        });

        expect(key).toBe(
            'stackExchange:stackoverflow-insights:tags=angular,rxjs,typescript',
        );
    });

    it('should normalize null and undefined values as empty strings', () => {
        const key = CacheKeyBuilder.build({
            provider: 'devTo',
            resource: 'articles-by-tag',
            params: {
                tag: 'angular',
                page: undefined,
                query: null,
            },
        });

        expect(key).toBe('devTo:articles-by-tag:page=&query=&tag=angular');
    });
});