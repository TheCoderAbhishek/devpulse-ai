import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { ApiArchitectureSmokeService } from '../../../../core/api/services/api-architecture-smoke.service';
import { StorageArchitectureSmokeService } from '../../../../core/storage/services/storage-architecture-smoke.service';
import { GithubWatchlistService } from '../../../github-analytics/data-access/services/github-watchlist.service';

@Component({
  selector: 'app-dashboard-home',
  imports: [AsyncPipe],
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
}