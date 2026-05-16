import { Component, inject } from '@angular/core';

import { ToastService } from '../../../services/toast.service';
import { ToastType } from '../../../models/toast.model';

@Component({
    selector: 'app-toast-container',
    imports: [],
    templateUrl: './toast-container.html',
    styleUrl: './toast-container.css',
})
export class ToastContainer {
    readonly toastService = inject(ToastService);

    isSuccess(type: ToastType): boolean {
        return type === 'success';
    }

    isError(type: ToastType): boolean {
        return type === 'error';
    }

    isWarning(type: ToastType): boolean {
        return type === 'warning';
    }

    isInfo(type: ToastType): boolean {
        return type === 'info';
    }
}