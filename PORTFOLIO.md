# DevPulse AI — Portfolio Case Study

## Project Summary

DevPulse AI is a production-grade, frontend-only developer intelligence platform built with Angular, RxJS, Tailwind CSS, Axios, and IndexedDB.

It helps developers, engineering leaders, and recruiters evaluate open-source repositories by combining GitHub repository data, Stack Overflow questions, DEV Community articles, Hacker News discussions, health scoring, watchlists, caching, and local analytics.

## Problem Statement

Developers often evaluate open-source libraries using scattered signals:

- GitHub stars and issues
- Release freshness
- Contributor activity
- Stack Overflow pain points
- Community discussions
- Technology adoption signals

DevPulse AI combines these signals into a single frontend-only intelligence dashboard without requiring custom backend infrastructure.

## My Role

Designed and implemented the full frontend architecture from scratch, including:

- Angular standalone component architecture
- Route-level lazy loading
- RxJS data orchestration
- Axios API client abstraction
- IndexedDB caching with Dexie
- Repository health scoring
- Watchlist persistence
- Stack Overflow insights
- DEV/Hacker News trend signals
- Settings and local token management
- Premium responsive UI/UX
- Azure Static Web Apps deployment

## Key Features

- GitHub repository search with filters
- Repository detail intelligence
- Repository health score
- Risk badges and technical recommendations
- Stack Overflow developer pain-point analysis
- DEV Community and Hacker News trend signals
- Local repository watchlist
- IndexedDB caching
- Optional provider tokens
- Dark/light/system theme toggle
- Toast notifications and confirm dialogs
- Offline and rate-limit banners
- Global frontend error handling
- SEO metadata
- Azure Static Web Apps hosting

## Technical Highlights

- Built a frontend-only architecture with no custom backend or database server
- Implemented public API orchestration using Axios and RxJS
- Designed a stale-while-revalidate cache layer using IndexedDB
- Used lazy-loaded route groups to reduce initial bundle size
- Implemented reusable premium UI components and theme-aware design tokens
- Added Vitest-based unit tests for services, mappers, stores, and components
- Deployed production build to Microsoft Azure Static Web Apps

## Business Value

DevPulse AI demonstrates the ability to build enterprise-quality frontend applications that are:

- Scalable
- Maintainable
- Performant
- API-driven
- Cloud-deployed
- Portfolio-ready
- Backend-independent

## Live Demo

Replace with your Azure URL:

```text
https://ashy-forest-00a623f00.7.azurestaticapps.net/