import { Injectable, inject } from '@angular/core';

import { AxiosClientFactory } from '../factories/axios-client.factory';
import { ProviderRegistryService } from './provider-registry.service';

@Injectable({
    providedIn: 'root',
})
export class ApiArchitectureSmokeService {
    private readonly providerRegistry = inject(ProviderRegistryService);
    private readonly axiosClientFactory = inject(AxiosClientFactory);

    verify(): boolean {
        const githubProvider = this.providerRegistry.getProvider('github');
        const githubClient = this.axiosClientFactory.getClient('github');

        return Boolean(githubProvider && githubClient);
    }
}