import { Routes } from '@angular/router';

export const watchlistsRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/watchlist-home/watchlist-home').then(
                (component) => component.WatchlistHome,
            ),
        title: 'Watchlist',
        data: {
            seo: {
                title: 'Repository Watchlist',
                description:
                    'Save and monitor GitHub repositories locally using IndexedDB-powered browser storage.',
                keywords: ['repository watchlist', 'IndexedDB', 'GitHub tracking'],
            },
        },
    },
];