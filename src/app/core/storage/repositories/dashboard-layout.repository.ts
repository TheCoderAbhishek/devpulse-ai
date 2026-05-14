import { Injectable, inject } from '@angular/core';
import { defer, from, map, Observable } from 'rxjs';

import { DashboardLayout } from '../models/dashboard-layout.model';
import { DevPulseIndexedDb } from '../indexeddb.database';

@Injectable({
    providedIn: 'root',
})
export class DashboardLayoutRepository {
    private readonly db = inject(DevPulseIndexedDb);

    getAll(): Observable<readonly DashboardLayout[]> {
        return defer(() =>
            from(this.db.dashboardLayouts.orderBy('updatedAt').reverse().toArray()),
        );
    }

    getById(id: string): Observable<DashboardLayout | null> {
        return defer(() => from(this.db.dashboardLayouts.get(id))).pipe(
            map((layout) => layout ?? null),
        );
    }

    getDefault(): Observable<DashboardLayout | null> {
        return defer(() =>
            from(this.db.dashboardLayouts.where('isDefault').equals(1).first()),
        ).pipe(map((layout) => layout ?? null));
    }

    put(layout: DashboardLayout): Observable<void> {
        return defer(() => from(this.db.dashboardLayouts.put(layout))).pipe(
            map(() => undefined),
        );
    }

    delete(id: string): Observable<void> {
        return defer(() => from(this.db.dashboardLayouts.delete(id))).pipe(
            map(() => undefined),
        );
    }

    clear(): Observable<void> {
        return defer(() => from(this.db.dashboardLayouts.clear())).pipe(
            map(() => undefined),
        );
    }

    count(): Observable<number> {
        return defer(() => from(this.db.dashboardLayouts.count()));
    }
}