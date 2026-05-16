import { StackOverflowQuestion } from './stackoverflow-question.model';

export interface StackOverflowInsightsParams {
    readonly tags: readonly string[];
    readonly query?: string;
    readonly page?: number;
    readonly pageSize?: number;
    readonly sort?: 'activity' | 'votes' | 'creation' | 'relevance';
    readonly order?: 'asc' | 'desc';
}

export interface StackOverflowInsightsSummary {
    readonly loadedQuestionCount: number;
    readonly answeredQuestionCount: number;
    readonly unansweredQuestionCount: number;
    readonly acceptedAnswerCount: number;
    readonly answeredRatio: number;
    readonly acceptedAnswerRatio: number;
    readonly averageScore: number;
    readonly totalAnswers: number;
    readonly totalViews: number;
    readonly mostCommonTags: readonly string[];
}

export interface StackOverflowPainPoint {
    readonly title: string;
    readonly description: string;
    readonly severity: 'low' | 'medium' | 'high';
    readonly matchingQuestionCount: number;
}

export interface StackOverflowInsights {
    readonly params: StackOverflowInsightsParams;
    readonly questions: readonly StackOverflowQuestion[];
    readonly summary: StackOverflowInsightsSummary;
    readonly painPoints: readonly StackOverflowPainPoint[];
    readonly quotaRemaining?: number;
    readonly quotaMax?: number;
    readonly backoffSeconds?: number;
    readonly loadedAt: string;
}