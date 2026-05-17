import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { CommunityTrendSignals } from '../../models/community-trend-signals.model';

@Component({
    selector: 'app-community-trend-signals-card',
    imports: [DatePipe, DecimalPipe],
    templateUrl: './community-trend-signals-card.html',
    styleUrl: './community-trend-signals-card.css',
})
export class CommunityTrendSignalsCard {
    @Input({ required: true }) signals!: CommunityTrendSignals;

    isLow(severity: string): boolean {
        return severity === 'low';
    }

    isMedium(severity: string): boolean {
        return severity === 'medium';
    }

    isHigh(severity: string): boolean {
        return severity === 'high';
    }
}