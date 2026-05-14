import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { GithubRepository } from '../../models/github-repository.model';

@Component({
    selector: 'app-repository-card',
    imports: [DecimalPipe, DatePipe],
    templateUrl: './repository-card.html',
    styleUrl: './repository-card.css',
})
export class RepositoryCard {
    @Input({ required: true }) repository!: GithubRepository;
}