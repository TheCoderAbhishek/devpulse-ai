export type ConfirmDialogTone = 'default' | 'danger' | 'warning';

export interface ConfirmDialogState {
    readonly open: boolean;
    readonly title: string;
    readonly message: string;
    readonly confirmLabel: string;
    readonly cancelLabel: string;
    readonly tone: ConfirmDialogTone;
}