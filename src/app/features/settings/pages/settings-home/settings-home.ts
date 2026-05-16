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
      return;
    }

    this.tokenVault.setToken('github', token);
    this.tokenForm.controls.github.setValue('');
    window.location.reload();
  }

  removeGithubToken(): void {
    this.tokenVault.removeToken('github');
    window.location.reload();
  }

  saveDevToken(): void {
    const token = this.tokenForm.controls.devTo.value.trim();

    if (!token) {
      return;
    }

    this.tokenVault.setToken('devTo', token);
    this.tokenForm.controls.devTo.setValue('');
    window.location.reload();
  }

  removeDevToken(): void {
    this.tokenVault.removeToken('devTo');
    window.location.reload();
  }

  saveAiToken(): void {
    const token = this.tokenForm.controls.ai.value.trim();

    if (!token) {
      return;
    }

    this.tokenVault.setToken('ai', token);
    this.tokenForm.controls.ai.setValue('');
    window.location.reload();
  }

  removeAiToken(): void {
    this.tokenVault.removeToken('ai');
    window.location.reload();
  }

  clearExpiredCache(): void {
    this.storageMaintenance.deleteExpiredCache().subscribe(() => {
      window.location.reload();
    });
  }

  clearApiCache(): void {
    const confirmed = window.confirm(
      'Clear all cached public API responses from IndexedDB?',
    );

    if (!confirmed) {
      return;
    }

    this.storageMaintenance.clearApiCache().subscribe(() => {
      window.location.reload();
    });
  }

  clearAllIndexedDbData(): void {
    const confirmed = window.confirm(
      'This will clear API cache, watchlist items, bookmarks, and dashboard layouts from IndexedDB. Continue?',
    );

    if (!confirmed) {
      return;
    }

    this.storageMaintenance.clearAllLocalData().subscribe(() => {
      window.location.reload();
    });
  }

  clearAllTokens(): void {
    const confirmed = window.confirm(
      'Remove all locally stored provider tokens?',
    );

    if (!confirmed) {
      return;
    }

    this.tokenVault.clearAllProviderTokens();
    window.location.reload();
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