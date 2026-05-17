import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/dashboard-home/dashboard-home').then(
                (component) => component.DashboardHome,
            ),
        title: 'Dashboard | DevPulse AI',
    },
];