import { Injectable } from '@angular/core';

import { API_PROVIDER_CONFIGS } from '../config/api-provider.config';
import { ApiProviderConfig, ApiProviderId } from '../models/api-provider.model';

@Injectable({
    providedIn: 'root',
})
export class ProviderRegistryService {
    private readonly providers = new Map<ApiProviderId, ApiProviderConfig>(
        API_PROVIDER_CONFIGS.map((provider) => [provider.id, provider]),
    );

    getProvider(providerId: ApiProviderId): ApiProviderConfig {
        const provider = this.providers.get(providerId);

        if (!provider) {
            throw new Error(`API provider '${providerId}' is not registered.`);
        }

        return provider;
    }

    getEnabledProviders(): readonly ApiProviderConfig[] {
        return [...this.providers.values()].filter((provider) => provider.enabled);
    }

    getAllProviders(): readonly ApiProviderConfig[] {
        return [...this.providers.values()];
    }

    isProviderEnabled(providerId: ApiProviderId): boolean {
        return this.getProvider(providerId).enabled;
    }
}