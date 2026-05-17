import { Component, inject } from '@angular/core';

import { ConfirmDialogService } from '../../../services/confirm-dialog.service';

@Component({
    selector: 'app-confirm-dialog',
    imports: [],
    templateUrl: './confirm-dialog.html',
    styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
    readonly confirmDialog = inject(ConfirmDialogService);
}