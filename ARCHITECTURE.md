# DevPulse AI — Architecture Overview

DevPulse AI is a frontend-only developer intelligence dashboard built with Angular, RxJS, Tailwind CSS, Axios, IndexedDB, and public APIs.

The application intentionally avoids custom backend infrastructure. All data orchestration, caching, state management, and user preferences are handled in the browser.

## Architecture Principles

- Frontend-only architecture
- Public/Open APIs only
- No custom backend
- No server-side database
- Browser-first persistence using IndexedDB and LocalStorage
- Route-level lazy loading
- RxJS-based data orchestration
- Axios-based API abstraction
- Production-grade error handling
- Azure Static Web Apps deployment

## High-Level Architecture

```mermaid
flowchart TD
    User[User Browser] --> Angular[Angular SPA]

    Angular --> Shell[App Shell + Lazy Routes]
    Angular --> State[Signals + RxJS Stores]
    Angular --> UI[Premium UI Components]
    Angular --> Cache[IndexedDB Cache Layer]
    Angular --> Storage[LocalStorage Settings]

    State --> API[Axios API Client Layer]
    API --> GitHub[GitHub REST API]
    API --> StackExchange[Stack Exchange API]
    API --> DevTo[DEV Community API]
    API --> HN[Hacker News API]

    Cache --> Dexie[Dexie IndexedDB]
    Storage --> Tokens[Optional Local Tokens]

    Angular --> Azure[Azure Static Web Apps]
```
