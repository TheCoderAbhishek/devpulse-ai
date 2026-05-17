import { TestBed } from '@angular/core/testing';

import { GithubContributor } from '../../models/github-contributor.model';
import { GithubRelease } from '../../models/github-release.model';
import { GithubRepository } from '../../models/github-repository.model';
import { GithubRepositoryHealthCalculatorService } from './github-repository-health-calculator.service';

describe('GithubRepositoryHealthCalculatorService', () => {
    let service: GithubRepositoryHealthCalculatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GithubRepositoryHealthCalculatorService);
    });

    it('should calculate excellent health for active popular repository', () => {
        const repository = createRepository({
            stars: 50000,
            openIssues: 100,
            pushedAt: new Date().toISOString(),
        });

        const contributors = Array.from({ length: 50 }, (_, index) =>
            createContributor(index),
        );

        const releases: GithubRelease[] = [
            {
                id: '1',
                tagName: 'v1.0.0',
                name: 'v1.0.0',
                url: 'https://github.com/demo/demo/releases/tag/v1.0.0',
                isDraft: false,
                isPrerelease: false,
                createdAt: new Date().toISOString(),
                publishedAt: new Date().toISOString(),
            },
        ];

        const health = service.calculate(repository, contributors, releases);

        expect(health.score).toBeGreaterThanOrEqual(85);
        expect(health.level).toBe('excellent');
        expect(health.signals.length).toBeGreaterThan(0);
        expect(health.recommendations.length).toBeGreaterThan(0);
    });

    it('should add high risk badge for archived repository', () => {
        const repository = createRepository({
            isArchived: true,
            pushedAt: '2020-01-01T00:00:00Z',
        });

        const health = service.calculate(repository, [], []);

        expect(health.riskBadges.some((badge) => badge.label === 'Archived')).toBe(true);
        expect(health.level).toBe('risky');
    });

    function createRepository(
        patch: Partial<GithubRepository> = {},
    ): GithubRepository {
        return {
            id: '1',
            nodeId: 'node-1',
            name: 'demo',
            fullName: 'demo/demo',
            description: 'Demo repository',
            url: 'https://github.com/demo/demo',
            apiUrl: 'https://api.github.com/repos/demo/demo',
            owner: {
                id: '10',
                username: 'demo',
                avatarUrl: '',
                profileUrl: '',
                type: 'User',
            },
            stars: 1000,
            watchers: 1000,
            forks: 100,
            openIssues: 10,
            language: 'TypeScript',
            topics: ['angular'],
            defaultBranch: 'main',
            sizeKb: 1000,
            isFork: false,
            isArchived: false,
            isDisabled: false,
            visibility: 'public',
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: new Date().toISOString(),
            pushedAt: new Date().toISOString(),
            ...patch,
        };
    }

    function createContributor(index: number): GithubContributor {
        return {
            id: String(index),
            username: `user-${index}`,
            avatarUrl: '',
            profileUrl: '',
            type: 'User',
            contributions: 10,
        };
    }
});