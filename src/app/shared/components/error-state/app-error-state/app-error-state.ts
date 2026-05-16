import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-error-state',
    imports: [],
    templateUrl: './app-error-state.html',
    styleUrl: './app-error-state.css',
})
export class AppErrorState {
    @Input({ required: true }) title = '';
    @Input() message = '';
    @Input() retryLabel = 'Retry';

    @Output() retryRequested = new EventEmitter<void>();

    onRetry(): void {
        this.retryRequested.emit();
    }
}