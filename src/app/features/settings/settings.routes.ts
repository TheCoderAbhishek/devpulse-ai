import { Routes } from '@angular/router';

export const settingsRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/settings-home/settings-home').then(
                (component) => component.SettingsHome,
            ),
        title: 'Settings',
        data: {
            seo: {
                title: 'Application Settings',
                description:
                    'Manage theme, optional provider tokens, cache controls, storage health, and diagnostics.',
                keywords: ['Angular settings', 'browser storage', 'API cache'],
            },
        },
    },
];