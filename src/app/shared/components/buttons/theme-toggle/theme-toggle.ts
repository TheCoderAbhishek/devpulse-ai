import { Component, inject } from '@angular/core';
import {
    LucideAngularModule,
    Monitor,
    Moon,
    Sun,
} from 'lucide-angular';

import { ThemeService } from '../../../../features/settings/services/theme.service';

@Component({
    selector: 'app-theme-toggle',
    imports: [LucideAngularModule],
    templateUrl: './theme-toggle.html',
    styleUrl: './theme-toggle.css',
})
export class ThemeToggle {
    readonly themeService = inject(ThemeService);

    readonly Sun = Sun;
    readonly Moon = Moon;
    readonly Monitor = Monitor;

    cycleTheme(): void {
        const current = this.themeService.themeMode();

        if (current === 'system') {
            this.themeService.setThemeMode('dark');
            return;
        }

        if (current === 'dark') {
            this.themeService.setThemeMode('light');
            return;
        }

        this.themeService.setThemeMode('system');
    }
}