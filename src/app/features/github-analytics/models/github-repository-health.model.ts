export type RepositoryHealthLevel =
    | 'excellent'
    | 'good'
    | 'moderate'
    | 'risky';

export type RepositoryHealthSignalImpact =
    | 'positive'
    | 'neutral'
    | 'negative';

export type RepositoryRiskSeverity =
    | 'low'
    | 'medium'
    | 'high';

export interface GithubRepositoryHealth {
    readonly score: number;
    readonly level: RepositoryHealthLevel;
    readonly summary: string;
    readonly signals: readonly RepositoryHealthSignal[];
    readonly riskBadges: readonly RepositoryRiskBadge[];
    readonly recommendations: readonly string[];
    readonly calculatedAt: string;
}

export interface RepositoryHealthSignal {
    readonly label: string;
    readonly value: string;
    readonly description: string;
    readonly score: number;
    readonly maxScore: number;
    readonly scoreImpact: RepositoryHealthSignalImpact;
}

export interface RepositoryRiskBadge {
    readonly label: string;
    readonly severity: RepositoryRiskSeverity;
    readonly description: string;
}