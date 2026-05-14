import { Injectable, inject } from '@angular/core';
import { AxiosRequestConfig } from 'axios';
import { defer, from, map, Observable, catchError, throwError } from 'rxjs';

import { AxiosClientFactory } from '../factories/axios-client.factory';
import { ApiErrorMapperService } from './api-error-mapper.service';
import { ApiProviderId } from '../models/api-provider.model';

@Injectable({
    providedIn: 'root',
})
export class ApiClientService {
    private readonly axiosClientFactory = inject(AxiosClientFactory);
    private readonly apiErrorMapper = inject(ApiErrorMapperService);

    get<T>(
        providerId: ApiProviderId,
        url: string,
        config?: AxiosRequestConfig,
    ): Observable<T> {
        const client = this.axiosClientFactory.getClient(providerId);

        return defer(() => from(client.get<T>(url, config))).pipe(
            map((response) => response.data),
            catchError((error: unknown) =>
                throwError(() => this.apiErrorMapper.toApiError(error, providerId)),
            ),
        );
    }

    post<TRequest, TResponse>(
        providerId: ApiProviderId,
        url: string,
        body: TRequest,
        config?: AxiosRequestConfig,
    ): Observable<TResponse> {
        const client = this.axiosClientFactory.getClient(providerId);

        return defer(() => from(client.post<TResponse>(url, body, config))).pipe(
            map((response) => response.data),
            catchError((error: unknown) =>
                throwError(() => this.apiErrorMapper.toApiError(error, providerId)),
            ),
        );
    }
}