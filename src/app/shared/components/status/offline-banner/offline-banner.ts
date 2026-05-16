import { Component, inject } from '@angular/core';

import { OfflineStatusService } from '../../../services/offline-status.service';

@Component({
    selector: 'app-offline-banner',
    imports: [],
    templateUrl: './offline-banner.html',
    styleUrl: './offline-banner.css',
})
export class OfflineBanner {
    readonly offlineStatus = inject(OfflineStatusService);
}