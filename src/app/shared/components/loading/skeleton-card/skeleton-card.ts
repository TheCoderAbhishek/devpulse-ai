import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-skeleton-card',
    imports: [],
    templateUrl: './skeleton-card.html',
    styleUrl: './skeleton-card.css',
})
export class SkeletonCard {
    @Input() rows = 3;
}