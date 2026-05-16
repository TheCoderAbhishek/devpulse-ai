export interface StackExchangeOwnerDto {
    readonly user_id?: number;
    readonly display_name?: string;
    readonly profile_image?: string;
    readonly link?: string;
    readonly reputation?: number;
    readonly user_type?: string;
}

export interface StackExchangeQuestionDto {
    readonly question_id: number;
    readonly title: string;
    readonly link: string;
    readonly tags: readonly string[];
    readonly score: number;
    readonly answer_count: number;
    readonly is_answered: boolean;
    readonly accepted_answer_id?: number;
    readonly view_count: number;
    readonly creation_date: number;
    readonly last_activity_date: number;
    readonly owner?: StackExchangeOwnerDto;
}