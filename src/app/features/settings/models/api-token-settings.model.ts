import { ApiProviderId } from '../../../core/api/models/api-provider.model';

export interface ApiTokenSetting {
    readonly providerId: ApiProviderId;
    readonly displayName: string;
    readonly description: string;
    readonly supportsToken: boolean;
    readonly hasToken: boolean;
}