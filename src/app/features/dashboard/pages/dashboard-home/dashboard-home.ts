import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiArchitectureSmokeService } from '../../../../core/api/services/api-architecture-smoke.service';
import { StorageArchitectureSmokeService } from '../../../../core/storage/services/storage-architecture-smoke.service';
import { CommunityTrendDashboardWidget } from '../../../community-trends/components/community-trend-dashboard-widget/community-trend-dashboard-widget';
import { GithubWatchlistService } from '../../../github-analytics/data-access/services/github-watchlist.service';
import { WatchlistHealthOverview } from '../../../watchlists/components/watchlist-health-overview/watchlist-health-overview';

@Component({
  selector: 'app-dashboard-home',
  imports: [
    AsyncPipe,
    RouterLink,
    WatchlistHealthOverview,
    CommunityTrendDashboardWidget,
  ],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css',
})
export class DashboardHome {
  private readonly apiSmokeService = inject(ApiArchitectureSmokeService);
  private readonly storageSmokeService = inject(StorageArchitectureSmokeService);
  private readonly githubWatchlistService = inject(GithubWatchlistService);

  readonly isApiArchitectureReady = this.apiSmokeService.verify();
  readonly isStorageArchitectureReady$ = this.storageSmokeService.verify();

  readonly trackedRepositoryCount$ =
    this.githubWatchlistService.trackedRepositoryCount$;

  readonly watchlistItems$ =
    this.githubWatchlistService.repositoryWatchlistItems$;
}