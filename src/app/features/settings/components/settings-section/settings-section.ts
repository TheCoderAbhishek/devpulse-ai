import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-settings-section',
    imports: [],
    templateUrl: './settings-section.html',
    styleUrl: './settings-section.css',
})
export class SettingsSection {
    @Input({ required: true }) title = '';
    @Input() description = '';
}