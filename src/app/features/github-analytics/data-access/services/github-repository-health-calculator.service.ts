import { Injectable } from '@angular/core';

import {
    GithubRepositoryHealth,
    RepositoryHealthSignal,
} from '../../models/github-repository-health.model';
import { GithubRepository } from '../../models/github-repository.model';
import { GithubContributor } from '../../models/github-contributor.model';
import { GithubRelease } from '../../models/github-release.model';

@Injectable({
    providedIn: 'root',
})
export class GithubRepositoryHealthCalculatorService {
    calculate(
        repository: GithubRepository,
        contributors: readonly GithubContributor[],
        releases: readonly GithubRelease[],
    ): GithubRepositoryHealth {
        const signals: RepositoryHealthSignal[] = [];

        const starScore = this.scoreStars(repository.stars);
        const contributorScore = this.scoreContributors(contributors.length);
        const releaseScore = this.scoreReleaseFreshness(releases);
        const issueScore = this.scoreIssueRatio(repository);
        const archiveScore = repository.isArchived || repository.isDisabled ? 0 : 20;

        signals.push({
            label: 'Stars',
            value: repository.stars.toLocaleString(),
            scoreImpact: starScore >= 15 ? 'positive' : 'neutral',
        });

        signals.push({
            label: 'Contributors',
            value: contributors.length.toLocaleString(),
            scoreImpact: contributorScore >= 15 ? 'positive' : 'neutral',
        });

        signals.push({
            label: 'Recent Releases',
            value: releases.length > 0 ? releases[0].tagName : 'No recent releases',
            scoreImpact: releaseScore >= 15 ? 'positive' : 'negative',
        });

        signals.push({
            label: 'Open Issues',
            value: repository.openIssues.toLocaleString(),
            scoreImpact: issueScore >= 15 ? 'positive' : 'neutral',
        });

        signals.push({
            label: 'Repository Status',
            value: repository.isArchived || repository.isDisabled ? 'Inactive' : 'Active',
            scoreImpact: archiveScore > 0 ? 'positive' : 'negative',
        });

        const score = Math.min(
            100,
            Math.round(starScore + contributorScore + releaseScore + issueScore + archiveScore),
        );

        return {
            score,
            level: this.toLevel(score),
            summary: this.toSummary(score),
            signals,
        };
    }

    private scoreStars(stars: number): number {
        if (stars >= 50000) return 20;
        if (stars >= 10000) return 18;
        if (stars >= 1000) return 15;
        if (stars >= 100) return 10;
        return 5;
    }

    private scoreContributors(contributorCount: number): number {
        if (contributorCount >= 50) return 20;
        if (contributorCount >= 20) return 18;
        if (contributorCount >= 10) return 15;
        if (contributorCount >= 3) return 10;
        return 5;
    }

    private scoreReleaseFreshness(releases: readonly GithubRelease[]): number {
        if (releases.length === 0 || !releases[0].publishedAt) {
            return 5;
        }

        const latestReleaseTime = new Date(releases[0].publishedAt).getTime();
        const daysSinceRelease =
            (Date.now() - latestReleaseTime) / (1000 * 60 * 60 * 24);

        if (daysSinceRelease <= 30) return 20;
        if (daysSinceRelease <= 90) return 18;
        if (daysSinceRelease <= 180) return 15;
        if (daysSinceRelease <= 365) return 10;
        return 5;
    }

    private scoreIssueRatio(repository: GithubRepository): number {
        if (repository.openIssues === 0) {
            return 20;
        }

        const issueToStarRatio = repository.openIssues / Math.max(repository.stars, 1);

        if (issueToStarRatio <= 0.01) return 20;
        if (issueToStarRatio <= 0.03) return 15;
        if (issueToStarRatio <= 0.05) return 10;
        return 5;
    }

    private toLevel(score: number): GithubRepositoryHealth['level'] {
        if (score >= 85) return 'excellent';
        if (score >= 70) return 'good';
        if (score >= 50) return 'moderate';
        return 'risky';
    }

    private toSummary(score: number): string {
        if (score >= 85) {
            return 'This repository shows strong open-source health signals.';
        }

        if (score >= 70) {
            return 'This repository appears healthy with some areas to monitor.';
        }

        if (score >= 50) {
            return 'This repository has moderate health signals and should be reviewed carefully.';
        }

        return 'This repository may have maintenance or adoption risks.';
    }
}