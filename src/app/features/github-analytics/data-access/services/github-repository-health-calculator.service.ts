import { Injectable } from '@angular/core';

import {
    GithubRepositoryHealth,
    RepositoryHealthSignal,
    RepositoryRiskBadge,
} from '../../models/github-repository-health.model';
import { GithubContributor } from '../../models/github-contributor.model';
import { GithubRelease } from '../../models/github-release.model';
import { GithubRepository } from '../../models/github-repository.model';

@Injectable({
    providedIn: 'root',
})
export class GithubRepositoryHealthCalculatorService {
    calculate(
        repository: GithubRepository,
        contributors: readonly GithubContributor[],
        releases: readonly GithubRelease[],
    ): GithubRepositoryHealth {
        const starSignal = this.buildStarSignal(repository);
        const contributorSignal = this.buildContributorSignal(contributors);
        const releaseSignal = this.buildReleaseSignal(releases);
        const issueSignal = this.buildIssueSignal(repository);
        const activitySignal = this.buildActivitySignal(repository);
        const statusSignal = this.buildStatusSignal(repository);

        const signals = [
            starSignal,
            contributorSignal,
            releaseSignal,
            issueSignal,
            activitySignal,
            statusSignal,
        ];

        const totalScore = signals.reduce((sum, signal) => sum + signal.score, 0);
        const totalMaxScore = signals.reduce((sum, signal) => sum + signal.maxScore, 0);
        const normalizedScore = Math.round((totalScore / totalMaxScore) * 100);

        return {
            score: normalizedScore,
            level: this.toLevel(normalizedScore),
            summary: this.toSummary(normalizedScore),
            signals,
            riskBadges: this.buildRiskBadges(repository, contributors, releases),
            recommendations: this.buildRecommendations(repository, contributors, releases),
            calculatedAt: new Date().toISOString(),
        };
    }

    private buildStarSignal(repository: GithubRepository): RepositoryHealthSignal {
        const score = this.scoreStars(repository.stars);

        return {
            label: 'Community Adoption',
            value: repository.stars.toLocaleString(),
            description: 'Measures public adoption using GitHub star count.',
            score,
            maxScore: 20,
            scoreImpact: score >= 15 ? 'positive' : score >= 10 ? 'neutral' : 'negative',
        };
    }

    private buildContributorSignal(
        contributors: readonly GithubContributor[],
    ): RepositoryHealthSignal {
        const score = this.scoreContributors(contributors.length);

        return {
            label: 'Contributor Strength',
            value: contributors.length.toLocaleString(),
            description: 'Measures contributor diversity from the loaded contributor sample.',
            score,
            maxScore: 20,
            scoreImpact: score >= 15 ? 'positive' : score >= 10 ? 'neutral' : 'negative',
        };
    }

    private buildReleaseSignal(
        releases: readonly GithubRelease[],
    ): RepositoryHealthSignal {
        const score = this.scoreReleaseFreshness(releases);
        const latestRelease = releases[0];

        return {
            label: 'Release Freshness',
            value: latestRelease?.publishedAt
                ? this.formatDaysAgo(latestRelease.publishedAt)
                : 'No recent releases',
            description: 'Measures whether the repository has recent release activity.',
            score,
            maxScore: 20,
            scoreImpact: score >= 15 ? 'positive' : score >= 10 ? 'neutral' : 'negative',
        };
    }

    private buildIssueSignal(repository: GithubRepository): RepositoryHealthSignal {
        const score = this.scoreIssueRatio(repository);
        const ratio = repository.openIssues / Math.max(repository.stars, 1);

        return {
            label: 'Issue Load',
            value: `${repository.openIssues.toLocaleString()} open issues`,
            description: `Issue-to-star ratio is ${(ratio * 100).toFixed(2)}%. Lower usually indicates healthier maintenance.`,
            score,
            maxScore: 15,
            scoreImpact: score >= 12 ? 'positive' : score >= 8 ? 'neutral' : 'negative',
        };
    }

    private buildActivitySignal(repository: GithubRepository): RepositoryHealthSignal {
        const score = this.scoreActivity(repository);

        return {
            label: 'Repository Activity',
            value: repository.pushedAt
                ? this.formatDaysAgo(repository.pushedAt)
                : 'No push date available',
            description: 'Measures how recently code was pushed to the repository.',
            score,
            maxScore: 15,
            scoreImpact: score >= 12 ? 'positive' : score >= 8 ? 'neutral' : 'negative',
        };
    }

    private buildStatusSignal(repository: GithubRepository): RepositoryHealthSignal {
        const score = repository.isArchived || repository.isDisabled ? 0 : 10;

        return {
            label: 'Repository Status',
            value: repository.isArchived || repository.isDisabled ? 'Inactive' : 'Active',
            description: 'Archived or disabled repositories are treated as higher risk.',
            score,
            maxScore: 10,
            scoreImpact: score > 0 ? 'positive' : 'negative',
        };
    }

    private buildRiskBadges(
        repository: GithubRepository,
        contributors: readonly GithubContributor[],
        releases: readonly GithubRelease[],
    ): readonly RepositoryRiskBadge[] {
        const badges: RepositoryRiskBadge[] = [];

        if (repository.isArchived) {
            badges.push({
                label: 'Archived',
                severity: 'high',
                description: 'This repository is archived and may no longer be maintained.',
            });
        }

        if (repository.isDisabled) {
            badges.push({
                label: 'Disabled',
                severity: 'high',
                description: 'This repository is disabled on GitHub.',
            });
        }

        if (contributors.length <= 2) {
            badges.push({
                label: 'Low Contributor Diversity',
                severity: 'medium',
                description: 'Very few contributors were found in the loaded contributor sample.',
            });
        }

        if (releases.length === 0) {
            badges.push({
                label: 'No Recent Releases',
                severity: 'medium',
                description: 'No release records were found in the recent release sample.',
            });
        }

        if (repository.openIssues > 0) {
            const issueRatio = repository.openIssues / Math.max(repository.stars, 1);

            if (issueRatio > 0.05) {
                badges.push({
                    label: 'High Issue Load',
                    severity: 'medium',
                    description: 'The repository has a relatively high number of open issues compared to stars.',
                });
            }
        }

        if (repository.pushedAt && this.daysSince(repository.pushedAt) > 365) {
            badges.push({
                label: 'Low Recent Activity',
                severity: 'high',
                description: 'The repository has not received recent code activity.',
            });
        }

        if (badges.length === 0) {
            badges.push({
                label: 'No Major Risk Detected',
                severity: 'low',
                description: 'No major risk indicators were detected from the currently loaded GitHub signals.',
            });
        }

        return badges;
    }

    private buildRecommendations(
        repository: GithubRepository,
        contributors: readonly GithubContributor[],
        releases: readonly GithubRelease[],
    ): readonly string[] {
        const recommendations: string[] = [];

        if (repository.isArchived || repository.isDisabled) {
            recommendations.push('Avoid adopting this repository for new production systems unless there is a strong reason.');
        }

        if (contributors.length < 5) {
            recommendations.push('Review contributor activity carefully because the loaded contributor sample is small.');
        }

        if (releases.length === 0) {
            recommendations.push('Check tags, changelog, and commit history manually because release metadata is limited.');
        }

        if (repository.openIssues > repository.stars * 0.05) {
            recommendations.push('Review open issues before adoption because issue volume appears high compared to adoption.');
        }

        if (repository.stars >= 10000 && !repository.isArchived) {
            recommendations.push('Repository has strong public adoption; compare release freshness and issue load before final selection.');
        }

        if (recommendations.length === 0) {
            recommendations.push('Repository looks healthy from the currently available public GitHub signals.');
        }

        return recommendations;
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
        const latestRelease = releases[0];

        if (!latestRelease?.publishedAt) {
            return 5;
        }

        const days = this.daysSince(latestRelease.publishedAt);

        if (days <= 30) return 20;
        if (days <= 90) return 18;
        if (days <= 180) return 15;
        if (days <= 365) return 10;
        return 5;
    }

    private scoreIssueRatio(repository: GithubRepository): number {
        if (repository.openIssues === 0) {
            return 15;
        }

        const issueToStarRatio = repository.openIssues / Math.max(repository.stars, 1);

        if (issueToStarRatio <= 0.01) return 15;
        if (issueToStarRatio <= 0.03) return 12;
        if (issueToStarRatio <= 0.05) return 8;
        return 4;
    }

    private scoreActivity(repository: GithubRepository): number {
        if (!repository.pushedAt) {
            return 5;
        }

        const days = this.daysSince(repository.pushedAt);

        if (days <= 30) return 15;
        if (days <= 90) return 13;
        if (days <= 180) return 10;
        if (days <= 365) return 7;
        return 3;
    }

    private toLevel(score: number): GithubRepositoryHealth['level'] {
        if (score >= 85) return 'excellent';
        if (score >= 70) return 'good';
        if (score >= 50) return 'moderate';
        return 'risky';
    }

    private toSummary(score: number): string {
        if (score >= 85) {
            return 'This repository shows excellent open-source health signals based on adoption, activity, releases, contributor strength, and issue load.';
        }

        if (score >= 70) {
            return 'This repository appears healthy overall, but some signals should still be reviewed before adoption.';
        }

        if (score >= 50) {
            return 'This repository has moderate health signals and should be reviewed carefully before production usage.';
        }

        return 'This repository has notable risk indicators and may require deeper manual review before adoption.';
    }

    private daysSince(dateValue: string): number {
        const time = new Date(dateValue).getTime();

        if (Number.isNaN(time)) {
            return Number.POSITIVE_INFINITY;
        }

        return Math.floor((Date.now() - time) / (1000 * 60 * 60 * 24));
    }

    private formatDaysAgo(dateValue: string): string {
        const days = this.daysSince(dateValue);

        if (!Number.isFinite(days)) {
            return 'Unknown';
        }

        if (days === 0) {
            return 'Today';
        }

        if (days === 1) {
            return '1 day ago';
        }

        return `${days.toLocaleString()} days ago`;
    }
}