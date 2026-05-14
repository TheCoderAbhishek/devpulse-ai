import { Injectable, signal } from '@angular/core';

import { ApiProviderId } from '../models/api-provider.model';
import { RateLimitSnapshot, RateLimitState } from '../models/rate-limit-state.model';

@Injectable({
    providedIn: 'root',
})
export class RateLimitManagerService {
    private readonly rateLimitSnapshot = signal<RateLimitSnapshot>({
        providers: {},
    });

    readonly snapshot = this.rateLimitSnapshot.asReadonly();

    updateRateLimitState(state: RateLimitState): void {
        this.rateLimitSnapshot.update((current) => ({
            providers: {
                ...current.providers,
                [state.provider]: state,
            },
        }));
    }

    getProviderState(providerId: ApiProviderId): RateLimitState | null {
        return this.rateLimitSnapshot().providers[providerId] ?? null;
    }

    isProviderLimited(providerId: ApiProviderId): boolean {
        const state = this.getProviderState(providerId);

        if (!state) {
            return false;
        }

        if (!state.isLimited) {
            return false;
        }

        if (!state.resetAt) {
            return true;
        }

        return new Date(state.resetAt).getTime() > Date.now();
    }

    clearProviderState(providerId: ApiProviderId): void {
        this.rateLimitSnapshot.update((current) => {
            const providers = { ...current.providers };
            delete providers[providerId];

            return { providers };
        });
    }
}