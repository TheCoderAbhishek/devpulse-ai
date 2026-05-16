export interface StackOverflowQuestionOwner {
    readonly id?: string;
    readonly displayName?: string;
    readonly profileImage?: string;
    readonly profileUrl?: string;
    readonly reputation?: number;
    readonly userType?: string;
}

export interface StackOverflowQuestion {
    readonly id: string;
    readonly title: string;
    readonly url: string;
    readonly tags: readonly string[];
    readonly score: number;
    readonly answerCount: number;
    readonly isAnswered: boolean;
    readonly hasAcceptedAnswer: boolean;
    readonly viewCount: number;
    readonly createdAt: string;
    readonly lastActivityAt: string;
    readonly owner?: StackOverflowQuestionOwner;
}