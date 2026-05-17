import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-empty-state',
    imports: [],
    templateUrl: './app-empty-state.html',
    styleUrl: './app-empty-state.css',
})
export class AppEmptyState {
    @Input({ required: true }) title = '';
    @Input() description = '';
    @Input() actionLabel = '';
}