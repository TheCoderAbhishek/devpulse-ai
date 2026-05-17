import { Injectable, signal } from '@angular/core';

import { ToastMessage, ToastType } from '../models/toast.model';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    private readonly toastsSignal = signal<readonly ToastMessage[]>([]);

    readonly toasts = this.toastsSignal.asReadonly();

    success(title: string, message?: string): void {
        this.show('success', title, message);
    }

    error(title: string, message?: string): void {
        this.show('error', title, message, 7000);
    }

    warning(title: string, message?: string): void {
        this.show('warning', title, message, 6000);
    }

    info(title: string, message?: string): void {
        this.show('info', title, message);
    }

    dismiss(id: string): void {
        this.toastsSignal.update((toasts) =>
            toasts.filter((toast) => toast.id !== id),
        );
    }

    clear(): void {
        this.toastsSignal.set([]);
    }

    private show(
        type: ToastType,
        title: string,
        message?: string,
        timeoutMs = 4500,
    ): void {
        const toast: ToastMessage = {
            id: this.createId(),
            type,
            title,
            message,
            createdAt: new Date().toISOString(),
            timeoutMs,
        };

        this.toastsSignal.update((toasts) => [toast, ...toasts].slice(0, 5));

        window.setTimeout(() => {
            this.dismiss(toast.id);
        }, timeoutMs);
    }

    private createId(): string {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }

        return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
}