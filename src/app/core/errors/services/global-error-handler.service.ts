import { ErrorHandler, Injectable, inject } from '@angular/core';

import { ErrorLogService } from './error-log.service';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
    private readonly errorLogService = inject(ErrorLogService);

    handleError(error: unknown): void {
        this.errorLogService.logError(error, 'angular-error-handler');
    }
}