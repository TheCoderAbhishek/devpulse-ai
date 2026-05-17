import { Routes } from '@angular/router';

export const githubAnalyticsRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/github-search/github-search').then(
                (component) => component.GithubSearch,
            ),
        title: 'GitHub Analytics',
        data: {
            seo: {
                title: 'GitHub Repository Intelligence',
                description:
                    'Search and analyze GitHub repositories using public APIs, RxJS, IndexedDB cache, and Angular.',
                keywords: ['GitHub search', 'Angular', 'RxJS', 'IndexedDB'],
            },
        },
    },
    {
        path: 'repository/:owner/:repo',
        loadComponent: () =>
            import('./pages/repository-detail/repository-detail').then(
                (component) => component.RepositoryDetail,
            ),
        title: 'Repository Detail',
        data: {
            seo: {
                title: 'Repository Detail',
                description:
                    'View repository health, README metadata, Stack Overflow insights, DEV articles, and Hacker News trend signals.',
                keywords: [
                    'repository health',
                    'Stack Overflow insights',
                    'DEV Community',
                    'Hacker News',
                ],
            },
        },
    },
];