import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { ConfirmDialog } from '../../shared/components/dialogs/confirm-dialog/confirm-dialog';
import { OfflineBanner } from '../../shared/components/status/offline-banner/offline-banner';
import { RateLimitBanner } from '../../shared/components/status/rate-limit-banner/rate-limit-banner';
import { ToastContainer } from '../../shared/components/toasts/toast-container/toast-container';
import { GlobalErrorPanel } from '../../core/errors/components/global-error-panel/global-error-panel';

@Component({
  selector: 'app-app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ConfirmDialog,
    OfflineBanner,
    RateLimitBanner,
    ToastContainer,
    GlobalErrorPanel,
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
})
export class AppShell { }