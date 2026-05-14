import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    getItem(key: string): string | null {
        if (!this.isBrowserStorageAvailable()) {
            return null;
        }

        return localStorage.getItem(key);
    }

    setItem(key: string, value: string): void {
        if (!this.isBrowserStorageAvailable()) {
            return;
        }

        localStorage.setItem(key, value);
    }

    removeItem(key: string): void {
        if (!this.isBrowserStorageAvailable()) {
            return;
        }

        localStorage.removeItem(key);
    }

    getJson<T>(key: string): T | null {
        const value = this.getItem(key);

        if (!value) {
            return null;
        }

        try {
            return JSON.parse(value) as T;
        } catch {
            this.removeItem(key);
            return null;
        }
    }

    setJson<T>(key: string, value: T): void {
        this.setItem(key, JSON.stringify(value));
    }

    private isBrowserStorageAvailable(): boolean {
        try {
            return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
        } catch {
            return false;
        }
    }
}