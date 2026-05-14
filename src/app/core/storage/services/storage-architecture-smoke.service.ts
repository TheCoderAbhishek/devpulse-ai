import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';

import { IndexedDbHealthService } from './indexeddb-health.service';
import { StorageInitializationService } from './storage-initialization.service';
import { StorageMaintenanceService } from './storage-maintenance.service';

@Injectable({
    providedIn: 'root',
})
export class StorageArchitectureSmokeService {
    private readonly indexedDbHealthService = inject(IndexedDbHealthService);
    private readonly storageInitializationService = inject(
        StorageInitializationService,
    );
    private readonly storageMaintenanceService = inject(StorageMaintenanceService);

    verify(): Observable<boolean> {
        return this.indexedDbHealthService.verify().pipe(
            switchMap((isHealthy) => {
                if (!isHealthy) {
                    return of(false);
                }

                return this.storageInitializationService.initialize().pipe(
                    switchMap(() => this.storageMaintenanceService.getStats()),
                    map((stats) => stats.dashboardLayoutCount > 0),
                );
            }),
            catchError(() => of(false)),
        );
    }
}