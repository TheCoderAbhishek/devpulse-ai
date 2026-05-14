import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { GithubRepository } from '../../models/github-repository.model';

@Component({
    selector: 'app-repository-card',
    imports: [DecimalPipe, DatePipe],
    templateUrl: './repository-card.html',
    styleUrl: './repository-card.css',
})
export class RepositoryCard {
    @Input({ required: true }) repository!: GithubRepository;
    @Input() isSaved = false;

    @Output() saveRequested = new EventEmitter<GithubRepository>();
    @Output() removeRequested = new EventEmitter<GithubRepository>();

    onWatchlistToggle(): void {
        if (this.isSaved) {
            this.removeRequested.emit(this.repository);
            return;
        }

        this.saveRequested.emit(this.repository);
    }
}