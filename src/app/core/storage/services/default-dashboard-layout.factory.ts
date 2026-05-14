import { Injectable } from '@angular/core';

import { DashboardLayout } from '../models/dashboard-layout.model';

@Injectable({
    providedIn: 'root',
})
export class DefaultDashboardLayoutFactory {
    create(): DashboardLayout {
        const now = new Date().toISOString();

        return {
            id: 'default-dashboard',
            name: 'Default Dashboard',
            description: 'Default DevPulse AI dashboard layout.',
            isDefault: true,
            createdAt: now,
            updatedAt: now,
            widgets: [
                {
                    widgetId: 'tracked-repositories',
                    title: 'Tracked Repositories',
                    enabled: true,
                    order: 1,
                    columnSpan: 1,
                },
                {
                    widgetId: 'api-sources',
                    title: 'API Sources',
                    enabled: true,
                    order: 2,
                    columnSpan: 1,
                },
                {
                    widgetId: 'backend-services',
                    title: 'Backend Services',
                    enabled: true,
                    order: 3,
                    columnSpan: 1,
                },
                {
                    widgetId: 'offline-ready',
                    title: 'Offline Ready',
                    enabled: true,
                    order: 4,
                    columnSpan: 1,
                },
            ],
        };
    }
}