import { Injectable, inject } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

import { ApiProviderId } from '../models/api-provider.model';
import { ProviderRegistryService } from '../services/provider-registry.service';
import { RateLimitManagerService } from '../services/rate-limit-manager.service';
import { TokenVaultService } from '../../security/token-vault.service';

@Injectable({
    providedIn: 'root',
})
export class AxiosClientFactory {
    private readonly providerRegistry = inject(ProviderRegistryService);
    private readonly tokenVault = inject(TokenVaultService);
    private readonly rateLimitManager = inject(RateLimitManagerService);

    private readonly clients = new Map<ApiProviderId, AxiosInstance>();

    getClient(providerId: ApiProviderId): AxiosInstance {
        const existingClient = this.clients.get(providerId);

        if (existingClient) {
            return existingClient;
        }

        const provider = this.providerRegistry.getProvider(providerId);

        const client = axios.create({
            baseURL: provider.baseUrl,
            timeout: provider.defaultTimeoutMs,
            headers: {
                Accept: 'application/json',
            },
        });

        client.interceptors.request.use((config) => {
            if (this.rateLimitManager.isProviderLimited(providerId)) {
                throw new Error(`Provider '${providerId}' is currently rate-limited.`);
            }

            const token = this.tokenVault.getToken(providerId);

            if (
                token &&
                provider.auth.authHeaderName &&
                provider.auth.authHeaderPrefix
            ) {
                config.headers[provider.auth.authHeaderName] =
                    `${provider.auth.authHeaderPrefix} ${token}`;
            } else if (token && provider.auth.authHeaderName) {
                config.headers[provider.auth.authHeaderName] = token;
            }

            return config;
        });

        client.interceptors.response.use((response) => {
            const limitHeader = response.headers['x-ratelimit-limit'];
            const remainingHeader = response.headers['x-ratelimit-remaining'];
            const resetHeader = response.headers['x-ratelimit-reset'];

            if (limitHeader && remainingHeader) {
                const resetAt = resetHeader
                    ? new Date(Number(resetHeader) * 1000).toISOString()
                    : undefined;

                this.rateLimitManager.updateRateLimitState({
                    provider: providerId,
                    limit: Number(limitHeader),
                    remaining: Number(remainingHeader),
                    used: Number(limitHeader) - Number(remainingHeader),
                    resetAt,
                    isLimited: Number(remainingHeader) <= 0,
                    lastUpdatedAt: new Date().toISOString(),
                });
            }

            return response;
        });

        this.clients.set(providerId, client);

        return client;
    }
}