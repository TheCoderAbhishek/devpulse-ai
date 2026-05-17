import { TestBed } from '@angular/core/testing';

import { GithubRepositoryDto } from '../dto/github-repository.dto';
import { GithubRepositoryMapper } from './github-repository.mapper';

describe('GithubRepositoryMapper', () => {
    let mapper: GithubRepositoryMapper;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        mapper = TestBed.inject(GithubRepositoryMapper);
    });

    it('should map GitHub repository DTO to domain model', () => {
        const dto: GithubRepositoryDto = {
            id: 1,
            node_id: 'node-1',
            name: 'rxjs',
            full_name: 'ReactiveX/rxjs',
            private: false,
            owner: {
                id: 10,
                login: 'ReactiveX',
                avatar_url: 'https://example.com/avatar.png',
                html_url: 'https://github.com/ReactiveX',
                type: 'Organization',
            },
            html_url: 'https://github.com/ReactiveX/rxjs',
            description: 'Reactive Extensions for JavaScript',
            fork: false,
            url: 'https://api.github.com/repos/ReactiveX/rxjs',
            created_at: '2015-01-01T00:00:00Z',
            updated_at: '2026-01-01T00:00:00Z',
            pushed_at: '2026-01-02T00:00:00Z',
            homepage: 'https://rxjs.dev',
            size: 12345,
            stargazers_count: 31000,
            watchers_count: 31000,
            language: 'TypeScript',
            forks_count: 3000,
            open_issues_count: 120,
            default_branch: 'master',
            topics: ['rxjs', 'observable', 'reactive-programming'],
            license: {
                key: 'apache-2.0',
                name: 'Apache License 2.0',
                spdx_id: 'Apache-2.0',
                url: 'https://api.github.com/licenses/apache-2.0',
            },
            archived: false,
            disabled: false,
            visibility: 'public',
            score: 1,
        };

        const result = mapper.toRepository(dto);

        expect(result.id).toBe('1');
        expect(result.fullName).toBe('ReactiveX/rxjs');
        expect(result.owner.username).toBe('ReactiveX');
        expect(result.language).toBe('TypeScript');
        expect(result.stars).toBe(31000);
        expect(result.license?.spdxId).toBe('Apache-2.0');
        expect(result.topics).toContain('rxjs');
    });

    it('should map null optional values to undefined', () => {
        const dto: GithubRepositoryDto = {
            id: 2,
            node_id: 'node-2',
            name: 'demo',
            full_name: 'demo/demo',
            private: false,
            owner: {
                id: 20,
                login: 'demo',
                avatar_url: '',
                html_url: '',
                type: 'User',
            },
            html_url: '',
            description: null,
            fork: false,
            url: '',
            created_at: '2026-01-01T00:00:00Z',
            updated_at: '2026-01-01T00:00:00Z',
            pushed_at: null,
            homepage: null,
            size: 0,
            stargazers_count: 0,
            watchers_count: 0,
            language: null,
            forks_count: 0,
            open_issues_count: 0,
            default_branch: 'main',
            topics: undefined,
            license: null,
            archived: false,
            disabled: false,
            visibility: 'public',
        };

        const result = mapper.toRepository(dto);

        expect(result.description).toBeUndefined();
        expect(result.language).toBeUndefined();
        expect(result.homepage).toBeUndefined();
        expect(result.pushedAt).toBeUndefined();
        expect(result.topics).toEqual([]);
    });
});