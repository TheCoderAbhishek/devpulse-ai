import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import {
    GithubRepositoryHealth,
    RepositoryHealthLevel,
    RepositoryRiskSeverity,
} from '../../models/github-repository-health.model';

@Component({
    selector: 'app-repository-health-card',
    imports: [DecimalPipe],
    templateUrl: './repository-health-card.html',
    styleUrl: './repository-health-card.css',
})
export class RepositoryHealthCard {
    @Input({ required: true }) health!: GithubRepositoryHealth;

    isExcellent(level: RepositoryHealthLevel): boolean {
        return level === 'excellent';
    }

    isGood(level: RepositoryHealthLevel): boolean {
        return level === 'good';
    }

    isModerate(level: RepositoryHealthLevel): boolean {
        return level === 'moderate';
    }

    isRisky(level: RepositoryHealthLevel): boolean {
        return level === 'risky';
    }

    isLowSeverity(severity: RepositoryRiskSeverity): boolean {
        return severity === 'low';
    }

    isMediumSeverity(severity: RepositoryRiskSeverity): boolean {
        return severity === 'medium';
    }

    isHighSeverity(severity: RepositoryRiskSeverity): boolean {
        return severity === 'high';
    }
}