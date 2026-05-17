import { Routes } from '@angular/router';

export const githubAnalyticsRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/github-search/github-search').then(
                (component) => component.GithubSearch,
            ),
        title: 'GitHub Analytics | DevPulse AI',
    },
    {
        path: 'repository/:owner/:repo',
        loadComponent: () =>
            import('./pages/repository-detail/repository-detail').then(
                (component) => component.RepositoryDetail,
            ),
        title: 'Repository Detail | DevPulse AI',
    },
];