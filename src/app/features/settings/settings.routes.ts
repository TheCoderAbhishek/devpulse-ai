import { Routes } from '@angular/router';

export const settingsRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/settings-home/settings-home').then(
                (component) => component.SettingsHome,
            ),
        title: 'Settings | DevPulse AI',
    },
];