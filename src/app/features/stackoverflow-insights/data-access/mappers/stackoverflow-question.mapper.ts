import { Injectable } from '@angular/core';

import { StackExchangeQuestionDto } from '../dto/stack-exchange-question.dto';
import { StackExchangeResponseDto } from '../dto/stack-exchange-response.dto';
import {
    StackOverflowInsights,
    StackOverflowInsightsParams,
    StackOverflowInsightsSummary,
    StackOverflowPainPoint,
} from '../../models/stackoverflow-insights.model';
import { StackOverflowQuestion } from '../../models/stackoverflow-question.model';

@Injectable({
    providedIn: 'root',
})
export class StackOverflowQuestionMapper {
    toQuestion(dto: StackExchangeQuestionDto): StackOverflowQuestion {
        return {
            id: String(dto.question_id),
            title: this.decodeHtml(dto.title),
            url: dto.link,
            tags: dto.tags,
            score: dto.score,
            answerCount: dto.answer_count,
            isAnswered: dto.is_answered,
            hasAcceptedAnswer: Boolean(dto.accepted_answer_id),
            viewCount: dto.view_count,
            createdAt: this.fromUnixSeconds(dto.creation_date),
            lastActivityAt: this.fromUnixSeconds(dto.last_activity_date),
            owner: dto.owner
                ? {
                    id: dto.owner.user_id ? String(dto.owner.user_id) : undefined,
                    displayName: dto.owner.display_name,
                    profileImage: dto.owner.profile_image,
                    profileUrl: dto.owner.link,
                    reputation: dto.owner.reputation,
                    userType: dto.owner.user_type,
                }
                : undefined,
        };
    }

    toInsights(
        response: StackExchangeResponseDto<StackExchangeQuestionDto>,
        params: StackOverflowInsightsParams,
    ): StackOverflowInsights {
        const questions = (response.items ?? []).map((item) =>
            this.toQuestion(item),
        );

        return {
            params,
            questions,
            summary: this.toSummary(questions),
            painPoints: this.toPainPoints(questions),
            quotaRemaining: response.quota_remaining,
            quotaMax: response.quota_max,
            backoffSeconds: response.backoff,
            loadedAt: new Date().toISOString(),
        };
    }

    private toSummary(
        questions: readonly StackOverflowQuestion[],
    ): StackOverflowInsightsSummary {
        const loadedQuestionCount = questions.length;
        const answeredQuestionCount = questions.filter(
            (question) => question.isAnswered,
        ).length;
        const acceptedAnswerCount = questions.filter(
            (question) => question.hasAcceptedAnswer,
        ).length;
        const totalAnswers = questions.reduce(
            (sum, question) => sum + question.answerCount,
            0,
        );
        const totalViews = questions.reduce(
            (sum, question) => sum + question.viewCount,
            0,
        );
        const totalScore = questions.reduce(
            (sum, question) => sum + question.score,
            0,
        );

        return {
            loadedQuestionCount,
            answeredQuestionCount,
            unansweredQuestionCount: loadedQuestionCount - answeredQuestionCount,
            acceptedAnswerCount,
            answeredRatio:
                loadedQuestionCount === 0
                    ? 0
                    : Math.round((answeredQuestionCount / loadedQuestionCount) * 100),
            acceptedAnswerRatio:
                loadedQuestionCount === 0
                    ? 0
                    : Math.round((acceptedAnswerCount / loadedQuestionCount) * 100),
            averageScore:
                loadedQuestionCount === 0
                    ? 0
                    : Math.round(totalScore / loadedQuestionCount),
            totalAnswers,
            totalViews,
            mostCommonTags: this.getMostCommonTags(questions),
        };
    }

    private toPainPoints(
        questions: readonly StackOverflowQuestion[],
    ): readonly StackOverflowPainPoint[] {
        const definitions: readonly {
            readonly title: string;
            readonly keywords: readonly string[];
            readonly description: string;
        }[] = [
                {
                    title: 'Runtime / Exception Issues',
                    keywords: ['error', 'exception', 'failed', 'crash', 'undefined', 'null'],
                    description:
                        'Questions suggest developers are facing runtime errors or unexpected failures.',
                },
                {
                    title: 'Build / Type Issues',
                    keywords: ['build', 'compile', 'typescript', 'type', 'cannot find'],
                    description:
                        'Questions suggest setup, typing, compiler, or build-pipeline problems.',
                },
                {
                    title: 'Configuration Problems',
                    keywords: ['config', 'configuration', 'setup', 'install', 'environment'],
                    description:
                        'Questions suggest developers need help with setup or configuration.',
                },
                {
                    title: 'Performance Concerns',
                    keywords: ['slow', 'performance', 'memory', 'optimize', 'large'],
                    description:
                        'Questions suggest performance or scalability concerns.',
                },
                {
                    title: 'API / Integration Issues',
                    keywords: ['api', 'cors', 'http', 'request', 'response', 'auth'],
                    description:
                        'Questions suggest integration challenges with APIs, HTTP, or authentication.',
                },
            ];

        const painPoints = definitions
            .map((definition) => {
                const matchingQuestionCount = questions.filter((question) =>
                    definition.keywords.some((keyword) =>
                        question.title.toLowerCase().includes(keyword),
                    ),
                ).length;

                return {
                    title: definition.title,
                    description: definition.description,
                    matchingQuestionCount,
                    severity: this.toSeverity(matchingQuestionCount, questions.length),
                } satisfies StackOverflowPainPoint;
            })
            .filter((painPoint) => painPoint.matchingQuestionCount > 0)
            .sort((a, b) => b.matchingQuestionCount - a.matchingQuestionCount);

        if (painPoints.length === 0 && questions.length > 0) {
            return [
                {
                    title: 'No Dominant Pain Point Detected',
                    description:
                        'The loaded Stack Overflow sample does not show one strong recurring issue pattern.',
                    matchingQuestionCount: 0,
                    severity: 'low',
                },
            ];
        }

        return painPoints.slice(0, 4);
    }

    private toSeverity(
        matchingQuestionCount: number,
        totalQuestionCount: number,
    ): 'low' | 'medium' | 'high' {
        if (totalQuestionCount === 0) {
            return 'low';
        }

        const ratio = matchingQuestionCount / totalQuestionCount;

        if (ratio >= 0.5) {
            return 'high';
        }

        if (ratio >= 0.25) {
            return 'medium';
        }

        return 'low';
    }

    private getMostCommonTags(
        questions: readonly StackOverflowQuestion[],
    ): readonly string[] {
        const tagCounts = new Map<string, number>();

        for (const question of questions) {
            for (const tag of question.tags) {
                tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
            }
        }

        return [...tagCounts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([tag]) => tag);
    }

    private fromUnixSeconds(value: number): string {
        return new Date(value * 1000).toISOString();
    }

    private decodeHtml(value: string): string {
        return value
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
    }
}