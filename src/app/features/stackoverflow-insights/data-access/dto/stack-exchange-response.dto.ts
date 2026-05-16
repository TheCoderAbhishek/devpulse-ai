export interface StackExchangeResponseDto<T> {
    readonly items?: readonly T[];
    readonly has_more?: boolean;
    readonly quota_max?: number;
    readonly quota_remaining?: number;
    readonly backoff?: number;
    readonly error_id?: number;
    readonly error_message?: string;
    readonly error_name?: string;
}