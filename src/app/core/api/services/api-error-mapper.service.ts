import { Injectable } from '@angular/core';
import { AxiosError, isCancel } from 'axios';

import { ApiError, createApiError } from '../models/api-error.model';
import { ApiProviderId } from '../models/api-provider.model';

@Injectable({
    providedIn: 'root',
})
export class ApiErrorMapperService {
    toApiError(error: unknown, provider?: ApiProviderId): ApiError {
        if (isCancel(error)) {
            return createApiError({
                type: 'cancelled',
                provider,
                message: 'The request was cancelled.',
                technicalMessage: 'Axios request cancellation detected.',
                retryable: false,
                recoverable: true,
            });
        }

        if (this.isAxiosError(error)) {
            return this.fromAxiosError(error, provider);
        }

        return createApiError({
            type: 'unknown',
            provider,
            message: 'An unexpected error occurred.',
            technicalMessage: error instanceof Error ? error.message : String(error),
            retryable: false,
            recoverable: true,
        });
    }

    private fromAxiosError(error: AxiosError, provider?: ApiProviderId): ApiError {
        const statusCode = error.response?.status;

        if (error.code === 'ECONNABORTED') {
            return createApiError({
                type: 'timeout',
                provider,
                statusCode,
                message: 'The request timed out.',
                technicalMessage: error.message,
                retryable: true,
                recoverable: true,
            });
        }

        if (!error.response) {
            return createApiError({
                type: 'network',
                provider,
                message: 'Network request failed. Please check your connection.',
                technicalMessage: error.message,
                retryable: true,
                recoverable: true,
            });
        }

        if (statusCode === 401) {
            return createApiError({
                type: 'unauthorized',
                provider,
                statusCode,
                message: 'Authentication failed. Please check your API token.',
                technicalMessage: error.message,
                retryable: false,
                recoverable: true,
            });
        }

        if (statusCode === 403) {
            return createApiError({
                type: 'forbidden',
                provider,
                statusCode,
                message: 'The request was forbidden or rate-limited.',
                technicalMessage: error.message,
                retryable: false,
                recoverable: true,
            });
        }

        if (statusCode === 404) {
            return createApiError({
                type: 'not-found',
                provider,
                statusCode,
                message: 'The requested resource was not found.',
                technicalMessage: error.message,
                retryable: false,
                recoverable: true,
            });
        }

        if (statusCode === 422 || statusCode === 400) {
            return createApiError({
                type: 'validation',
                provider,
                statusCode,
                message: 'The request was invalid.',
                technicalMessage: error.message,
                retryable: false,
                recoverable: true,
            });
        }

        if (statusCode === 429) {
            return createApiError({
                type: 'rate-limited',
                provider,
                statusCode,
                message: 'API rate limit reached. Cached data may be shown if available.',
                technicalMessage: error.message,
                retryable: true,
                recoverable: true,
            });
        }

        if (statusCode && statusCode >= 500) {
            return createApiError({
                type: 'server',
                provider,
                statusCode,
                message: 'The provider service is temporarily unavailable.',
                technicalMessage: error.message,
                retryable: true,
                recoverable: true,
            });
        }

        return createApiError({
            type: 'unknown',
            provider,
            statusCode,
            message: 'An unexpected API error occurred.',
            technicalMessage: error.message,
            retryable: false,
            recoverable: true,
        });
    }

    private isAxiosError(error: unknown): error is AxiosError {
        return Boolean(
            error &&
            typeof error === 'object' &&
            'isAxiosError' in error &&
            (error as AxiosError).isAxiosError,
        );
    }
}