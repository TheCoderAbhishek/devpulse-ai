import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  GithubRepositorySearchOrder,
  GithubRepositorySearchParams,
  GithubRepositorySearchSort,
} from '../../models/github-repository-search-params.model';
import { GithubSearchStore } from '../../stores/github-search.store';
import { RepositoryCard } from '../../components/repository-card/repository-card';

interface GithubSearchFormValue {
  readonly query: string;
  readonly language: string;
  readonly topic: string;
  readonly minStars: number;
  readonly sort: GithubRepositorySearchSort;
  readonly order: GithubRepositorySearchOrder;
  readonly includeForks: boolean;
}

@Component({
  selector: 'app-github-search',
  imports: [AsyncPipe, DecimalPipe, ReactiveFormsModule, RepositoryCard],
  providers: [GithubSearchStore],
  templateUrl: './github-search.html',
  styleUrl: './github-search.css',
})
export class GithubSearch {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly store = inject(GithubSearchStore);
  readonly vm$ = this.store.vm$;

  readonly languages = [
    '',
    'TypeScript',
    'JavaScript',
    'Python',
    'C#',
    'Java',
    'Go',
    'Rust',
    'Dart',
    'Kotlin',
    'PHP',
  ];

  readonly sortOptions: readonly {
    readonly label: string;
    readonly value: GithubRepositorySearchSort;
  }[] = [
      {
        label: 'Stars',
        value: 'stars',
      },
      {
        label: 'Recently Updated',
        value: 'updated',
      },
      {
        label: 'Forks',
        value: 'forks',
      },
      {
        label: 'Best Match',
        value: 'best-match',
      },
    ];

  readonly searchForm = this.formBuilder.nonNullable.group({
    query: this.formBuilder.nonNullable.control('angular rxjs', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    language: this.formBuilder.nonNullable.control('TypeScript'),
    topic: this.formBuilder.nonNullable.control(''),
    minStars: this.formBuilder.nonNullable.control(1000, {
      validators: [Validators.min(0)],
    }),
    sort: this.formBuilder.nonNullable.control<GithubRepositorySearchSort>(
      'stars',
    ),
    order: this.formBuilder.nonNullable.control<GithubRepositorySearchOrder>(
      'desc',
    ),
    includeForks: this.formBuilder.nonNullable.control(false),
  });

  constructor() {
    this.searchForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.searchForm.valid) {
          this.store.updateSearchParams(this.toSearchParams());
        }
      });

    this.store.searchNow(this.toSearchParams());
  }

  onSubmit(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    this.store.searchNow(this.toSearchParams());
  }

  onRefresh(): void {
    this.store.refresh();
  }

  getErrorMessage(error: unknown): string {
    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      return error.message;
    }

    return 'An unexpected error occurred while searching GitHub repositories.';
  }

  private toSearchParams(): GithubRepositorySearchParams {
    const rawValue = this.searchForm.getRawValue() as GithubSearchFormValue;

    return {
      query: rawValue.query,
      language: rawValue.language || undefined,
      topic: rawValue.topic || undefined,
      minStars: Number(rawValue.minStars),
      sort: rawValue.sort,
      order: rawValue.order,
      includeForks: rawValue.includeForks,
      page: 1,
      perPage: 12,
    };
  }
}