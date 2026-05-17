import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ThemeService } from './features/settings/services/theme.service';
import { RouteSeoService } from './core/seo/services/route-seo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly themeService = inject(ThemeService);
  private readonly routeSeoService = inject(RouteSeoService);

  constructor() {
    this.routeSeoService.initialize();
  }
}