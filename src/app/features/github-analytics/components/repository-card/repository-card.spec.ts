import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GithubRepository } from '../../models/github-repository.model';
import { RepositoryCard } from './repository-card';

describe('RepositoryCard', () => {
    let fixture: ComponentFixture<RepositoryCard>;
    let component: RepositoryCard;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RepositoryCard],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(RepositoryCard);
        component = fixture.componentInstance;
        component.repository = createRepository();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit save request when repository is not saved', () => {
        const emitSpy = vi.spyOn(component.saveRequested, 'emit');

        component.isSaved = false;
        component.onWatchlistToggle();

        expect(emitSpy).toHaveBeenCalledWith(component.repository);
    });

    it('should emit remove request when repository is saved', () => {
        const emitSpy = vi.spyOn(component.removeRequested, 'emit');

        component.isSaved = true;
        component.onWatchlistToggle();

        expect(emitSpy).toHaveBeenCalledWith(component.repository);
    });

    function createRepository(): GithubRepository {
        return {
            id: '1',
            nodeId: 'node-1',
            name: 'rxjs',
            fullName: 'ReactiveX/rxjs',
            description: 'Reactive Extensions for JavaScript',
            url: 'https://github.com/ReactiveX/rxjs',
            apiUrl: 'https://api.github.com/repos/ReactiveX/rxjs',
            owner: {
                id: '10',
                username: 'ReactiveX',
                avatarUrl: 'https://example.com/avatar.png',
                profileUrl: 'https://github.com/ReactiveX',
                type: 'Organization',
            },
            stars: 31000,
            watchers: 31000,
            forks: 3000,
            openIssues: 100,
            language: 'TypeScript',
            topics: ['rxjs', 'observables'],
            defaultBranch: 'master',
            sizeKb: 12000,
            isFork: false,
            isArchived: false,
            isDisabled: false,
            visibility: 'public',
            createdAt: '2015-01-01T00:00:00Z',
            updatedAt: '2026-01-01T00:00:00Z',
            pushedAt: '2026-01-02T00:00:00Z',
        };
    }
});