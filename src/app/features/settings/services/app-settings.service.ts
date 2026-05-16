import { Injectable, inject, signal } from '@angular/core';

import { LocalStorageService } from '../../../core/storage/local-storage.service';
import {
    AppSettings,
    DEFAULT_APP_SETTINGS,
    ThemeMode,
} from '../models/app-settings.model';
import { ThemeService } from './theme.service';

const SETTINGS_STORAGE_KEY = 'devpulse.settings.app';

@Injectable({
    providedIn: 'root',
})
export class AppSettingsService {
    private readonly localStorageService = inject(LocalStorageService);
    private readonly themeService = inject(ThemeService);

    private readonly settingsSignal = signal<AppSettings>(this.loadSettings());

    readonly settings = this.settingsSignal.asReadonly();

    updateThemeMode(themeMode: ThemeMode): void {
        this.updateSettings({
            themeMode,
        });

        this.themeService.setThemeMode(themeMode);
    }

    updateSettings(patch: Partial<AppSettings>): void {
        const updatedSettings: AppSettings = {
            ...this.settingsSignal(),
            ...patch,
        };

        this.settingsSignal.set(updatedSettings);
        this.localStorageService.setJson(SETTINGS_STORAGE_KEY, updatedSettings);
    }

    resetSettings(): void {
        this.settingsSignal.set(DEFAULT_APP_SETTINGS);
        this.localStorageService.setJson(SETTINGS_STORAGE_KEY, DEFAULT_APP_SETTINGS);
        this.themeService.setThemeMode(DEFAULT_APP_SETTINGS.themeMode);
    }

    private loadSettings(): AppSettings {
        const storedSettings =
            this.localStorageService.getJson<AppSettings>(SETTINGS_STORAGE_KEY);

        return {
            ...DEFAULT_APP_SETTINGS,
            ...storedSettings,
        };
    }
}