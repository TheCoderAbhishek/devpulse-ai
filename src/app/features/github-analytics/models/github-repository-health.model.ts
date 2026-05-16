export type RepositoryHealthLevel = 'excellent' | 'good' | 'moderate' | 'risky';

export interface GithubRepositoryHealth {
    readonly score: number;
    readonly level: RepositoryHealthLevel;
    readonly summary: string;
    readonly signals: readonly RepositoryHealthSignal[];
}

export interface RepositoryHealthSignal {
    readonly label: string;
    readonly value: string;
    readonly scoreImpact: 'positive' | 'neutral' | 'negative';
}