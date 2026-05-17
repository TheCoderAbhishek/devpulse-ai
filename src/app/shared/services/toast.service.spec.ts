import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ToastService } from './toast.service';

describe('ToastService', () => {
    let service: ToastService;

    beforeEach(() => {
        vi.useFakeTimers();

        TestBed.configureTestingModule({});
        service = TestBed.inject(ToastService);
    });

    afterEach(() => {
        service.clear();
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it('should add success toast', () => {
        service.success('Saved', 'Repository saved successfully.');

        const toasts = service.toasts();

        expect(toasts.length).toBe(1);
        expect(toasts[0].type).toBe('success');
        expect(toasts[0].title).toBe('Saved');
    });

    it('should dismiss toast by id', () => {
        service.info('Info');

        const toastId = service.toasts()[0].id;

        service.dismiss(toastId);

        expect(service.toasts().length).toBe(0);
    });

    it('should auto-dismiss toast after timeout', () => {
        service.success('Saved');

        expect(service.toasts().length).toBe(1);

        vi.advanceTimersByTime(4499);
        expect(service.toasts().length).toBe(1);

        vi.advanceTimersByTime(1);
        expect(service.toasts().length).toBe(0);
    });

    it('should clear all toasts', () => {
        service.success('Saved');
        service.error('Failed');

        service.clear();

        expect(service.toasts().length).toBe(0);
    });
});