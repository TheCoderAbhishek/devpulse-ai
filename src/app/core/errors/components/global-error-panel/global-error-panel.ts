import { Component, inject } from '@angular/core';

import { ErrorLogService } from '../../services/error-log.service';

@Component({
    selector: 'app-global-error-panel',
    imports: [],
    templateUrl: './global-error-panel.html',
    styleUrl: './global-error-panel.css',
})
export class GlobalErrorPanel {
    readonly errorLogService = inject(ErrorLogService);
}