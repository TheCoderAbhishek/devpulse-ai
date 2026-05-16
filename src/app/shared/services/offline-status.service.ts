import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class OfflineStatusService {
    private readonly isOnlineSignal = signal<boolean>(this.getInitialStatus());

    readonly isOnline = this.isOnlineSignal.asReadonly();

    constructor() {
        if (typeof window === 'undefined') {
            return;
        }

        window.addEventListener('online', () => {
            this.isOnlineSignal.set(true);
        });

        window.addEventListener('offline', () => {
            this.isOnlineSignal.set(false);
        });
    }

    private getInitialStatus(): boolean {
        if (typeof navigator === 'undefined') {
            return true;
        }

        return navigator.onLine;
    }
}