import { TestBed } from '@angular/core/testing';

import { StackExchangeQuestionDto } from '../dto/stack-exchange-question.dto';
import { StackExchangeResponseDto } from '../dto/stack-exchange-response.dto';
import { StackOverflowQuestionMapper } from './stackoverflow-question.mapper';

describe('StackOverflowQuestionMapper', () => {
    let mapper: StackOverflowQuestionMapper;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        mapper = TestBed.inject(StackOverflowQuestionMapper);
    });

    it('should map Stack Exchange question DTO to domain model', () => {
        const dto: StackExchangeQuestionDto = {
            question_id: 100,
            title: 'Angular &amp; RxJS switchMap issue',
            link: 'https://stackoverflow.com/questions/100',
            tags: ['angular', 'rxjs'],
            score: 5,
            answer_count: 2,
            is_answered: true,
            accepted_answer_id: 200,
            view_count: 1000,
            creation_date: 1700000000,
            last_activity_date: 1700001000,
            owner: {
                user_id: 1,
                display_name: 'Test User',
                reputation: 100,
                user_type: 'registered',
            },
        };

        const result = mapper.toQuestion(dto);

        expect(result.id).toBe('100');
        expect(result.title).toBe('Angular & RxJS switchMap issue');
        expect(result.hasAcceptedAnswer).toBe(true);
        expect(result.owner?.displayName).toBe('Test User');
    });

    it('should create insights summary and pain points', () => {
        const response: StackExchangeResponseDto<StackExchangeQuestionDto> = {
            items: [
                {
                    question_id: 1,
                    title: 'Angular build error cannot find module',
                    link: '',
                    tags: ['angular', 'typescript'],
                    score: 1,
                    answer_count: 1,
                    is_answered: true,
                    accepted_answer_id: 10,
                    view_count: 500,
                    creation_date: 1700000000,
                    last_activity_date: 1700001000,
                },
                {
                    question_id: 2,
                    title: 'RxJS switchMap api request failed',
                    link: '',
                    tags: ['rxjs'],
                    score: 2,
                    answer_count: 0,
                    is_answered: false,
                    view_count: 300,
                    creation_date: 1700000000,
                    last_activity_date: 1700001000,
                },
            ],
            quota_remaining: 100,
            quota_max: 300,
        };

        const insights = mapper.toInsights(response, {
            tags: ['angular', 'rxjs'],
        });

        expect(insights.summary.loadedQuestionCount).toBe(2);
        expect(insights.summary.answeredRatio).toBe(50);
        expect(insights.summary.acceptedAnswerRatio).toBe(50);
        expect(insights.painPoints.length).toBeGreaterThan(0);
    });
});