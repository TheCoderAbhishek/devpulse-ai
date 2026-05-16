import { Injectable, effect, signal } from '@angular/core';

import { ThemeMode } from '../models/app-settings.model';

const THEME_STORAGE_KEY = 'devpulse.settings.themeMode';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private readonly themeModeSignal = signal<ThemeMode>(this.getInitialTheme());

    readonly themeMode = this.themeModeSignal.asReadonly();

    constructor() {
        effect(() => {
            this.applyTheme(this.themeModeSignal());
        });

        if (typeof window !== 'undefined') {
            window
                .matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change', () => {
                    if (this.themeModeSignal() === 'system') {
                        this.applyTheme('system');
                    }
                });
        }
    }

    setThemeMode(themeMode: ThemeMode): void {
        this.themeModeSignal.set(themeMode);

        if (this.isBrowser()) {
            localStorage.setItem(THEME_STORAGE_KEY, themeMode);
        }
    }

    private getInitialTheme(): ThemeMode {
        if (!this.isBrowser()) {
            return 'system';
        }

        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

        if (
            storedTheme === 'system' ||
            storedTheme === 'light' ||
            storedTheme === 'dark'
        ) {
            return storedTheme;
        }

        return 'system';
    }

    private applyTheme(themeMode: ThemeMode): void {
        if (!this.isBrowser()) {
            return;
        }

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldUseDark = themeMode === 'dark' || (themeMode === 'system' && prefersDark);

        document.documentElement.classList.toggle('dark', shouldUseDark);
        document.documentElement.dataset['theme'] = shouldUseDark ? 'dark' : 'light';
    }

    private isBrowser(): boolean {
        return typeof window !== 'undefined' && typeof document !== 'undefined';
    }
}