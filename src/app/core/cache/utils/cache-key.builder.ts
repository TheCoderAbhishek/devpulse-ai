import { ApiProviderId } from '../../api/models/api-provider.model';

export interface CacheKeyParams {
    readonly provider: ApiProviderId;
    readonly resource: string;
    readonly params?: Record<string, unknown>;
}

export class CacheKeyBuilder {
    static build(input: CacheKeyParams): string {
        const normalizedParams = input.params
            ? CacheKeyBuilder.normalizeParams(input.params)
            : 'no-params';

        return `${input.provider}:${input.resource}:${normalizedParams}`;
    }

    private static normalizeParams(params: Record<string, unknown>): string {
        return Object.keys(params)
            .sort()
            .map((key) => `${key}=${CacheKeyBuilder.normalizeValue(params[key])}`)
            .join('&');
    }

    private static normalizeValue(value: unknown): string {
        if (value === null || value === undefined) {
            return '';
        }

        if (Array.isArray(value)) {
            return value.map((item) => String(item)).sort().join(',');
        }

        if (typeof value === 'object') {
            return JSON.stringify(value);
        }

        return String(value);
    }
}