import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { GithubRepository } from '../../../github-analytics/models/github-repository.model';
import { DevArticlesRepository } from './dev-articles.repository';
import { HackerNewsRepository } from './hacker-news.repository';
import { CommunityKeywordBuilderService } from '../services/community-keyword-builder.service';
import { CommunityTrendAnalyzerService } from '../services/community-trend-analyzer.service';
import { CommunityTrendSignals } from '../../models/community-trend-signals.model';

@Injectable({
    providedIn: 'root',
})
export class CommunityTrendSignalsRepository {
    private readonly devArticlesRepository = inject(DevArticlesRepository);
    private readonly hackerNewsRepository = inject(HackerNewsRepository);
    private readonly keywordBuilder = inject(CommunityKeywordBuilderService);
    private readonly analyzer = inject(CommunityTrendAnalyzerService);

    getRepositoryTrendSignals(
        repository: GithubRepository,
        forceRefresh = false,
    ): Observable<CommunityTrendSignals> {
        const keywords = this.keywordBuilder.fromRepository(repository);
        const primaryTag = keywords[0] ?? repository.language?.toLowerCase() ?? repository.name.toLowerCase();

        const devArticles$ = this.devArticlesRepository
            .searchByTag(
                {
                    tag: primaryTag,
                    page: 1,
                    perPage: 6,
                    top: 30,
                },
                forceRefresh,
            )
            .pipe(
                map((state) => (state.status === 'success' ? state.data : [])),
                catchError(() => of([])),
            );

        const hackerNewsStories$ = this.hackerNewsRepository
            .getTopStorySignals(
                {
                    keywords,
                    storyLimit: 6,
                    candidateLimit: 30,
                },
                forceRefresh,
            )
            .pipe(
                map((state) => (state.status === 'success' ? state.data : [])),
                catchError(() => of([])),
            );

        return forkJoin({
            devArticles: devArticles$,
            hackerNewsStories: hackerNewsStories$,
        }).pipe(
            map(({ devArticles, hackerNewsStories }) =>
                this.analyzer.buildSignals(
                    {
                        keywords,
                        sourceContext: repository.fullName,
                    },
                    devArticles,
                    hackerNewsStories,
                ),
            ),
        );
    }
}