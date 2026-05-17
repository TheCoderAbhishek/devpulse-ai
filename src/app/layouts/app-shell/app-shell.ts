import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  BarChart3,
  Bookmark,
  Github,
  Home,
  LucideAngularModule,
  Settings,
  Sparkles,
} from 'lucide-angular';

import { GlobalErrorPanel } from '../../core/errors/components/global-error-panel/global-error-panel';
import { ConfirmDialog } from '../../shared/components/dialogs/confirm-dialog/confirm-dialog';
import { OfflineBanner } from '../../shared/components/status/offline-banner/offline-banner';
import { RateLimitBanner } from '../../shared/components/status/rate-limit-banner/rate-limit-banner';
import { ToastContainer } from '../../shared/components/toasts/toast-container/toast-container';
import { ThemeToggle } from '../../shared/components/buttons/theme-toggle/theme-toggle';

@Component({
  selector: 'app-app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LucideAngularModule,
    ConfirmDialog,
    OfflineBanner,
    RateLimitBanner,
    ToastContainer,
    GlobalErrorPanel,
    ThemeToggle,
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
})
export class AppShell {
  readonly Home = Home;
  readonly Github = Github;
  readonly Bookmark = Bookmark;
  readonly Settings = Settings;
  readonly BarChart3 = BarChart3;
  readonly Sparkles = Sparkles;
}