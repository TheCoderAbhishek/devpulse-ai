export interface ApiRequestOptions {
    readonly useCache?: boolean;
    readonly forceRefresh?: boolean;
    readonly timeoutMs?: number;
    readonly correlationId?: string;
    readonly abortSignal?: AbortSignal;
    readonly queryParams?: Record<string, string | number | boolean | undefined>;
    readonly headers?: Record<string, string>;
}