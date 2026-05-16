import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { StackOverflowInsights } from '../../models/stackoverflow-insights.model';

@Component({
    selector: 'app-stackoverflow-insights-card',
    imports: [DatePipe, DecimalPipe],
    templateUrl: './stackoverflow-insights-card.html',
    styleUrl: './stackoverflow-insights-card.css',
})
export class StackOverflowInsightsCard {
    @Input({ required: true }) insights!: StackOverflowInsights;

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