import { Injectable, inject } from '@angular/core';

import { ApiProviderId } from '../api/models/api-provider.model';
import { ProviderRegistryService } from '../api/services/provider-registry.service';
import { LocalStorageService } from '../storage/local-storage.service';

@Injectable({
    providedIn: 'root',
})
export class TokenVaultService {
    private readonly providerRegistry = inject(ProviderRegistryService);
    private readonly localStorageService = inject(LocalStorageService);

    getToken(providerId: ApiProviderId): string | null {
        const provider = this.providerRegistry.getProvider(providerId);
        const tokenStorageKey = provider.auth.tokenStorageKey;

        if (!tokenStorageKey) {
            return null;
        }

        return this.localStorageService.getItem(tokenStorageKey);
    }

    setToken(providerId: ApiProviderId, token: string): void {
        const provider = this.providerRegistry.getProvider(providerId);
        const tokenStorageKey = provider.auth.tokenStorageKey;

        if (!tokenStorageKey) {
            throw new Error(`Provider '${providerId}' does not support token storage.`);
        }

        this.localStorageService.setItem(tokenStorageKey, token);
    }

    removeToken(providerId: ApiProviderId): void {
        const provider = this.providerRegistry.getProvider(providerId);
        const tokenStorageKey = provider.auth.tokenStorageKey;

        if (!tokenStorageKey) {
            return;
        }

        this.localStorageService.removeItem(tokenStorageKey);
    }

    hasToken(providerId: ApiProviderId): boolean {
        return Boolean(this.getToken(providerId));
    }
}