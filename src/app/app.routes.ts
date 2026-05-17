import { Routes } from '@angular/router';

import { AppShell } from './layouts/app-shell/app-shell';

export const routes: Routes = [
    {
        path: '',
        component: AppShell,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard',
            },
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('./features/dashboard/dashboard.routes').then(
                        (routes) => routes.dashboardRoutes,
                    ),
            },
            {
                path: 'github',
                loadChildren: () =>
                    import('./features/github-analytics/github-analytics.routes').then(
                        (routes) => routes.githubAnalyticsRoutes,
                    ),
            },
            {
                path: 'watchlist',
                loadChildren: () =>
                    import('./features/watchlists/watchlists.routes').then(
                        (routes) => routes.watchlistsRoutes,
                    ),
            },
            {
                path: 'settings',
                loadChildren: () =>
                    import('./features/settings/settings.routes').then(
                        (routes) => routes.settingsRoutes,
                    ),
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    },
];