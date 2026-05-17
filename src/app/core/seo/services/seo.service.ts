import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { environment } from '../../../../environments/environment';
import { SeoRouteData } from '../models/seo-route-data.model';

@Injectable({
    providedIn: 'root',
})
export class SeoService {
    private readonly title = inject(Title);
    private readonly meta = inject(Meta);

    updateSeo(data: Partial<SeoRouteData>): void {
        const pageTitle = data.title
            ? `${data.title} | ${environment.appName}`
            : environment.appName;

        const description = data.description ?? environment.appDescription;
        const keywords = data.keywords?.join(', ') ?? '';

        this.title.setTitle(pageTitle);

        this.meta.updateTag({
            name: 'description',
            content: description,
        });

        this.meta.updateTag({
            name: 'keywords',
            content: keywords,
        });

        this.meta.updateTag({
            name: 'author',
            content: environment.authorName,
        });

        this.meta.updateTag({
            property: 'og:title',
            content: pageTitle,
        });

        this.meta.updateTag({
            property: 'og:description',
            content: description,
        });

        this.meta.updateTag({
            property: 'og:type',
            content: 'website',
        });

        this.meta.updateTag({
            property: 'og:url',
            content: environment.siteUrl,
        });

        this.meta.updateTag({
            name: 'twitter:card',
            content: 'summary_large_image',
        });

        this.meta.updateTag({
            name: 'twitter:title',
            content: pageTitle,
        });

        this.meta.updateTag({
            name: 'twitter:description',
            content: description,
        });
    }
}