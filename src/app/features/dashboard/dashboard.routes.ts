import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/dashboard-home/dashboard-home').then(
                (component) => component.DashboardHome,
            ),
        title: 'Dashboard',
        data: {
            seo: {
                title: 'Developer Intelligence Dashboard',
                description:
                    'Track repository health, watchlist analytics, and community trend signals in DevPulse AI.',
                keywords: ['GitHub analytics', 'developer dashboard', 'repository health'],
            },
        },
    },
];