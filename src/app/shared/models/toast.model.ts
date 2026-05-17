export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
    readonly id: string;
    readonly type: ToastType;
    readonly title: string;
    readonly message?: string;
    readonly createdAt: string;
    readonly timeoutMs: number;
}