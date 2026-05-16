import { Injectable } from '@angular/core';

import { GithubRepository } from '../../../github-analytics/models/github-repository.model';

@Injectable({
    providedIn: 'root',
})
export class StackOverflowTagBuilderService {
    private readonly aliases = new Map<string, string>([
        ['typescript', 'typescript'],
        ['javascript', 'javascript'],
        ['python', 'python'],
        ['c#', 'c#'],
        ['csharp', 'c#'],
        ['java', 'java'],
        ['go', 'go'],
        ['golang', 'go'],
        ['rust', 'rust'],
        ['angular', 'angular'],
        ['rxjs', 'rxjs'],
        ['react', 'reactjs'],
        ['reactjs', 'reactjs'],
        ['vue', 'vue.js'],
        ['vuejs', 'vue.js'],
        ['node', 'node.js'],
        ['nodejs', 'node.js'],
        ['firebase', 'firebase'],
        ['indexeddb', 'indexeddb'],
        ['tailwind', 'tailwind-css'],
        ['tailwindcss', 'tailwind-css'],
        ['dotnet', '.net'],
        ['.net', '.net'],
        ['aspnetcore', 'asp.net-core'],
        ['asp.net-core', 'asp.net-core'],
    ]);

    fromRepository(repository: GithubRepository): readonly string[] {
        const candidates = [
            repository.language,
            repository.name,
            ...repository.topics,
        ]
            .filter((value): value is string => Boolean(value))
            .map((value) => this.normalize(value))
            .filter((value): value is string => Boolean(value));

        return [...new Set(candidates)].slice(0, 4);
    }

    normalize(value: string): string | null {
        const normalized = value
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/_/g, '-');

        if (this.aliases.has(normalized)) {
            return this.aliases.get(normalized) ?? null;
        }

        const safeValue = normalized
            .replace(/[^a-z0-9+#.-]/g, '')
            .slice(0, 35);

        return safeValue || null;
    }
}