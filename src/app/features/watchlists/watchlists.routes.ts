import { Routes } from '@angular/router';

export const watchlistsRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/watchlist-home/watchlist-home').then(
                (component) => component.WatchlistHome,
            ),
        title: 'Watchlist | DevPulse AI',
    },
];