import { Component, computed, inject } from '@angular/core';

import { RateLimitManagerService } from '../../../../core/api/services/rate-limit-manager.service';

@Component({
    selector: 'app-rate-limit-banner',
    imports: [],
    templateUrl: './rate-limit-banner.html',
    styleUrl: './rate-limit-banner.css',
})
export class RateLimitBanner {
    private readonly rateLimitManager = inject(RateLimitManagerService);

    readonly limitedProviders = computed(() => {
        const providers = this.rateLimitManager.snapshot().providers;

        return Object.values(providers).filter(
            (provider) => provider?.isLimited,
        );
    });
}