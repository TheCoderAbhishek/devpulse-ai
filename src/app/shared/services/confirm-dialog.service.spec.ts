import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { ConfirmDialogService } from './confirm-dialog.service';

describe('ConfirmDialogService', () => {
    let service: ConfirmDialogService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ConfirmDialogService);
    });

    it('should open confirm dialog with provided options', () => {
        service.confirm({
            title: 'Delete item?',
            message: 'This action cannot be undone.',
            confirmLabel: 'Delete',
            tone: 'danger',
        });

        expect(service.state().open).toBe(true);
        expect(service.state().title).toBe('Delete item?');
        expect(service.state().confirmLabel).toBe('Delete');
        expect(service.state().tone).toBe('danger');
    });

    it('should resolve true when accepted', async () => {
        const promise = service.confirm({
            title: 'Confirm?',
            message: 'Proceed?',
        });

        service.accept();

        await expect(promise).resolves.toBe(true);
        expect(service.state().open).toBe(false);
    });

    it('should resolve false when cancelled', async () => {
        const promise = service.confirm({
            title: 'Confirm?',
            message: 'Proceed?',
        });

        service.cancel();

        await expect(promise).resolves.toBe(false);
        expect(service.state().open).toBe(false);
    });
});