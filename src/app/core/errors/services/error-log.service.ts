import { Injectable, signal } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { AppErrorLogEntry, PublicErrorState } from '../models/app-error.model';

const ERROR_LOG_STORAGE_KEY = 'devpulse.errors.recent';
const MAX_ERROR_LOGS = 20;

@Injectable({
    providedIn: 'root',
})
export class ErrorLogService {
    private readonly errorsSignal = signal<readonly AppErrorLogEntry[]>(
        this.loadErrors(),
    );

    private readonly publicErrorSignal = signal<PublicErrorState>({
        hasError: false,
        title: '',
        message: '',
    });

    readonly errors = this.errorsSignal.asReadonly();
    readonly publicError = this.publicErrorSignal.asReadonly();

    logError(error: unknown, source = 'global'): AppErrorLogEntry {
        const entry: AppErrorLogEntry = {
            id: this.createId(),
            message: this.getErrorMessage(error),
            stack: this.getErrorStack(error),
            source,
            route: this.getCurrentRoute(),
            createdAt: new Date().toISOString(),
            userAgent: this.getUserAgent(),
        };

        this.errorsSignal.update((entries) =>
            [entry, ...entries].slice(0, MAX_ERROR_LOGS),
        );

        this.persistErrors();

        this.publicErrorSignal.set({
            hasError: true,
            title: 'Something went wrong',
            message:
                'DevPulse AI encountered an unexpected frontend error. You can continue using the app or refresh the page.',
            errorId: entry.id,
        });

        if (environment.enableConsoleLogging) {
            console.error('[DevPulse AI Error]', entry);
        }

        return entry;
    }

    dismissPublicError(): void {
        this.publicErrorSignal.set({
            hasError: false,
            title: '',
            message: '',
        });
    }

    clearErrors(): void {
        this.errorsSignal.set([]);
        this.persistErrors();
        this.dismissPublicError();
    }

    private loadErrors(): readonly AppErrorLogEntry[] {
        if (!this.isBrowser()) {
            return [];
        }

        try {
            const raw = localStorage.getItem(ERROR_LOG_STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    private persistErrors(): void {
        if (!this.isBrowser()) {
            return;
        }

        localStorage.setItem(
            ERROR_LOG_STORAGE_KEY,
            JSON.stringify(this.errorsSignal()),
        );
    }

    private getErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }

        if (
            error &&
            typeof error === 'object' &&
            'message' in error &&
            typeof error.message === 'string'
        ) {
            return error.message;
        }

        return String(error);
    }

    private getErrorStack(error: unknown): string | undefined {
        return error instanceof Error ? error.stack : undefined;
    }

    private getCurrentRoute(): string | undefined {
        if (!this.isBrowser()) {
            return undefined;
        }

        return window.location.pathname + window.location.search;
    }

    private getUserAgent(): string | undefined {
        if (!this.isBrowser()) {
            return undefined;
        }

        return navigator.userAgent;
    }

    private createId(): string {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }

        return `error-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    private isBrowser(): boolean {
        return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    }
}