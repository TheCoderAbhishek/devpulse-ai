import { Injectable, signal } from '@angular/core';

import { ConfirmDialogState, ConfirmDialogTone } from '../models/confirm-dialog.model';

interface ConfirmDialogOptions {
    readonly title: string;
    readonly message: string;
    readonly confirmLabel?: string;
    readonly cancelLabel?: string;
    readonly tone?: ConfirmDialogTone;
}

@Injectable({
    providedIn: 'root',
})
export class ConfirmDialogService {
    private resolver: ((value: boolean) => void) | null = null;

    private readonly stateSignal = signal<ConfirmDialogState>({
        open: false,
        title: '',
        message: '',
        confirmLabel: 'Confirm',
        cancelLabel: 'Cancel',
        tone: 'default',
    });

    readonly state = this.stateSignal.asReadonly();

    confirm(options: ConfirmDialogOptions): Promise<boolean> {
        this.stateSignal.set({
            open: true,
            title: options.title,
            message: options.message,
            confirmLabel: options.confirmLabel ?? 'Confirm',
            cancelLabel: options.cancelLabel ?? 'Cancel',
            tone: options.tone ?? 'default',
        });

        return new Promise<boolean>((resolve) => {
            this.resolver = resolve;
        });
    }

    accept(): void {
        this.close(true);
    }

    cancel(): void {
        this.close(false);
    }

    private close(result: boolean): void {
        this.stateSignal.update((state) => ({
            ...state,
            open: false,
        }));

        this.resolver?.(result);
        this.resolver = null;
    }
}