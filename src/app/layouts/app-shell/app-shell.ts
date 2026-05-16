import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { ConfirmDialog } from '../../shared/components/dialogs/confirm-dialog/confirm-dialog';
import { OfflineBanner } from '../../shared/components/status/offline-banner/offline-banner';
import { RateLimitBanner } from '../../shared/components/status/rate-limit-banner/rate-limit-banner';
import { ToastContainer } from '../../shared/components/toasts/toast-container/toast-container';

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
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
})
export class AppShell { }