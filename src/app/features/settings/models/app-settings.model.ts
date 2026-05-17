export type ThemeMode = 'system' | 'light' | 'dark';

export interface AppSettings {
    readonly themeMode: ThemeMode;
    readonly apiCacheEnabled: boolean;
    readonly showDeveloperDiagnostics: boolean;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
    themeMode: 'system',
    apiCacheEnabled: true,
    showDeveloperDiagnostics: true,
};