import { Injectable, inject } from '@angular/core';
import { map, Observable, switchMap, of } from 'rxjs';

import { DashboardLayoutRepository } from '../repositories/dashboard-layout.repository';
import { DefaultDashboardLayoutFactory } from './default-dashboard-layout.factory';

@Injectable({
    providedIn: 'root',
})
export class StorageInitializationService {
    private readonly dashboardLayoutRepository = inject(DashboardLayoutRepository);
    private readonly defaultDashboardLayoutFactory = inject(
        DefaultDashboardLayoutFactory,
    );

    initialize(): Observable<void> {
        return this.dashboardLayoutRepository.getDefault().pipe(
            switchMap((defaultLayout) => {
                if (defaultLayout) {
                    return of(undefined);
                }

                return this.dashboardLayoutRepository.put(
                    this.defaultDashboardLayoutFactory.create(),
                );
            }),
            map(() => undefined),
        );
    }
}