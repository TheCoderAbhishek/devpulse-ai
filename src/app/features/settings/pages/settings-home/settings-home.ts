import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

import { ProviderRegistryService } from '../../../../core/api/services/provider-registry.service';
import { RateLimitManagerService } from '../../../../core/api/services/rate-limit-manager.service';
import { TokenVaultService } from '../../../../core/security/token-vault.service';
import { IndexedDbHealthService } from '../../../../core/storage/services/indexeddb-health.service';
import { StorageMaintenanceService } from '../../../../core/storage/services/storage-maintenance.service';
import { SettingsSection } from '../../components/settings-section/settings-section';
import { ApiTokenSetting } from '../../models/api-token-settings.model';
import { ThemeMode } from '../../models/app-settings.model';
import { AppSettingsService } from '../../services/app-settings.service';
import { ThemeService } from '../../services/theme.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-settings-home',
  imports: [AsyncPipe, KeyValuePipe, ReactiveFormsModule, SettingsSection],
  templateUrl: './settings-home.html',
  styleUrl: './settings-home.css',
})
export class SettingsHome {
  private readonly formBuilder = inject(FormBuilder);
  private readonly providerRegistry = inject(ProviderRegistryService);
  private readonly tokenVault = inject(TokenVaultService);
  private readonly storageMaintenance = inject(StorageMaintenanceService);
  private readonly indexedDbHealth = inject(IndexedDbHealthService);
  private readonly appSettingsService = inject(AppSettingsService);
  private readonly themeService = inject(ThemeService);
  private readonly rateLimitManager = inject(RateLimitManagerService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly toastService = inject(ToastService);

  readonly settings = this.appSettingsService.settings;
  readonly themeMode = this.themeService.themeMode;
  readonly rateLimitSnapshot = this.rateLimitManager.snapshot;

  readonly storageStats$ = this.storageMaintenance.getStats();
  readonly storageHealth$ = this.indexedDbHealth.verify();

  readonly tokenSettings: readonly ApiTokenSetting[] =
    this.providerRegistry.getAllProviders().map((provider) => ({
      providerId: provider.id,
      displayName: provider.displayName,
      description: this.getProviderDescription(provider.id),
      supportsToken: Boolean(provider.auth.tokenStorageKey),
      hasToken: this.tokenVault.hasToken(provider.id),
    }));

  readonly tokenForm = this.formBuilder.nonNullable.group({
    github: this.formBuilder.nonNullable.control(''),
    devTo: this.formBuilder.nonNullable.control(''),
    ai: this.formBuilder.nonNullable.control(''),
  });

  setThemeMode(themeMode: ThemeMode): void {
    this.appSettingsService.updateThemeMode(themeMode);
  }

  toggleApiCacheEnabled(): void {
    this.appSettingsService.updateSettings({
      apiCacheEnabled: !this.settings().apiCacheEnabled,
    });
  }

  toggleDeveloperDiagnostics(): void {
    this.appSettingsService.updateSettings({
      showDeveloperDiagnostics: !this.settings().showDeveloperDiagnostics,
    });
  }

  saveGithubToken(): void {
    const token = this.tokenForm.controls.github.value.trim();

    if (!token) {
      this.toastService.warning('Token is empty', 'Paste a GitHub token before saving.');
      return;
    }

    this.tokenVault.setToken('github', token);
    this.tokenForm.controls.github.setValue('');

    this.toastService.success(
      'GitHub token saved',
      'The token was saved locally in this browser.',
    );
  }

  removeGithubToken(): void {
    this.tokenVault.removeToken('github');

    this.toastService.info(
      'GitHub token removed',
      'The local GitHub token was removed.',
    );
  }

  saveDevToken(): void {
    const token = this.tokenForm.controls.devTo.value.trim();

    if (!token) {
      this.toastService.warning('Token is empty', 'Paste a DEV token before saving.');
      return;
    }

    this.tokenVault.setToken('devTo', token);
    this.tokenForm.controls.devTo.setValue('');

    this.toastService.success(
      'DEV token saved',
      'The token was saved locally in this browser.',
    );
  }

  removeDevToken(): void {
    this.tokenVault.removeToken('devTo');

    this.toastService.info(
      'DEV token removed',
      'The local DEV token was removed.',
    );
  }

  saveAiToken(): void {
    const token = this.tokenForm.controls.ai.value.trim();

    if (!token) {
      this.toastService.warning('Token is empty', 'Paste an AI provider token before saving.');
      return;
    }

    this.tokenVault.setToken('ai', token);
    this.tokenForm.controls.ai.setValue('');

    this.toastService.success(
      'AI provider token saved',
      'The token was saved locally in this browser.',
    );
  }

  removeAiToken(): void {
    this.tokenVault.removeToken('ai');

    this.toastService.info(
      'AI provider token removed',
      'The local AI provider token was removed.',
    );
  }

  clearExpiredCache(): void {
    this.storageMaintenance.deleteExpiredCache().subscribe({
      next: (deletedCount) => {
        this.toastService.success(
          'Expired cache cleared',
          `${deletedCount} expired cache records were removed.`,
        );
      },
      error: () => {
        this.toastService.error(
          'Cache cleanup failed',
          'Unable to clear expired cache records.',
        );
      },
    });
  }

  async clearApiCache(): Promise<void> {
    const confirmed = await this.confirmDialogService.confirm({
      title: 'Clear API cache?',
      message: 'This will clear all cached public API responses from IndexedDB. Watchlist data will remain.',
      confirmLabel: 'Clear Cache',
      cancelLabel: 'Cancel',
      tone: 'warning',
    });

    if (!confirmed) {
      return;
    }

    this.storageMaintenance.clearApiCache().subscribe({
      next: () => {
        this.toastService.success(
          'API cache cleared',
          'Cached public API responses were removed.',
        );
      },
      error: () => {
        this.toastService.error(
          'Cache clear failed',
          'Unable to clear API cache.',
        );
      },
    });
  }

  async clearAllIndexedDbData(): Promise<void> {
    const confirmed = await this.confirmDialogService.confirm({
      title: 'Clear all IndexedDB data?',
      message: 'This will clear API cache, watchlist items, bookmarks, and dashboard layouts from IndexedDB.',
      confirmLabel: 'Clear All Data',
      cancelLabel: 'Cancel',
      tone: 'danger',
    });

    if (!confirmed) {
      return;
    }

    this.storageMaintenance.clearAllLocalData().subscribe({
      next: () => {
        this.toastService.warning(
          'IndexedDB data cleared',
          'All local IndexedDB data was removed. Refresh may reinitialize default layout.',
        );
      },
      error: () => {
        this.toastService.error(
          'Data clear failed',
          'Unable to clear IndexedDB data.',
        );
      },
    });
  }

  async clearAllTokens(): Promise<void> {
    const confirmed = await this.confirmDialogService.confirm({
      title: 'Clear all provider tokens?',
      message: 'This removes all locally stored provider tokens from LocalStorage.',
      confirmLabel: 'Clear Tokens',
      cancelLabel: 'Cancel',
      tone: 'danger',
    });

    if (!confirmed) {
      return;
    }

    this.tokenVault.clearAllProviderTokens();

    this.toastService.warning(
      'Provider tokens cleared',
      'All locally stored provider tokens were removed.',
    );
  }

  resetSettings(): void {
    this.appSettingsService.resetSettings();
  }

  hasToken(providerId: 'github' | 'devTo' | 'ai'): boolean {
    return this.tokenVault.hasToken(providerId);
  }

  private getProviderDescription(providerId: string): string {
    switch (providerId) {
      case 'github':
        return 'Optional token increases GitHub API rate limits for public repository data.';
      case 'devTo':
        return 'Optional DEV token is reserved for authenticated DEV API usage.';
      case 'ai':
        return 'Placeholder for future user-configured AI provider integration.';
      case 'stackExchange':
        return 'Public Stack Exchange API integration is currently unauthenticated.';
      case 'hackerNews':
        return 'Hacker News public API does not require authentication.';
      case 'reddit':
        return 'Reddit integration is currently disabled until a browser-safe OAuth flow is added.';
      default:
        return 'Public provider integration.';
    }
  }
}