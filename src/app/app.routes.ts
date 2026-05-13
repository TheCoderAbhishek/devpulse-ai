import { Routes } from '@angular/router';

import { AppShell } from './layouts/app-shell/app-shell';
import { DashboardHome } from './features/dashboard/pages/dashboard-home/dashboard-home';
import { GithubSearch } from './features/github-analytics/pages/github-search/github-search';
import { SettingsHome } from './features/settings/pages/settings-home/settings-home';

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
                component: DashboardHome,
                title: 'Dashboard | DevPulse AI',
            },
            {
                path: 'github',
                component: GithubSearch,
                title: 'GitHub Analytics | DevPulse AI',
            },
            {
                path: 'settings',
                component: SettingsHome,
                title: 'Settings | DevPulse AI',
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    },
];