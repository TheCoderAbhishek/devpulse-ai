export interface AppErrorLogEntry {
    readonly id: string;
    readonly message: string;
    readonly stack?: string;
    readonly source?: string;
    readonly route?: string;
    readonly createdAt: string;
    readonly userAgent?: string;
}

export interface PublicErrorState {
    readonly hasError: boolean;
    readonly title: string;
    readonly message: string;
    readonly errorId?: string;
}