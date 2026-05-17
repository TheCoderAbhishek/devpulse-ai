import { Injectable, inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    NavigationEnd,
    Router,
} from '@angular/router';
import { filter } from 'rxjs';

import { SeoRouteData } from '../models/seo-route-data.model';
import { SeoService } from './seo.service';

@Injectable({
    providedIn: 'root',
})
export class RouteSeoService {
    private readonly router = inject(Router);
    private readonly seoService = inject(SeoService);

    initialize(): void {
        this.router.events
            .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
            .subscribe(() => {
                const deepestRoute = this.getDeepestRoute(
                    this.router.routerState.snapshot.root,
                );

                const seo = deepestRoute.data['seo'] as Partial<SeoRouteData> | undefined;

                this.seoService.updateSeo({
                    title: deepestRoute.title?.toString() ?? seo?.title,
                    description: seo?.description,
                    keywords: seo?.keywords,
                    imageUrl: seo?.imageUrl,
                });
            });
    }

    private getDeepestRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
        let current = route;

        while (current.firstChild) {
            current = current.firstChild;
        }

        return current;
    }
}