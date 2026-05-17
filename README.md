# DevPulse AI

> Frontend-only developer intelligence dashboard built with Angular, RxJS, Tailwind CSS, Axios, IndexedDB, public APIs, and deployed on Microsoft Azure Static Web Apps.

## Live Demo

```text
https://ashy-forest-00a623f00.7.azurestaticapps.net
```

DevPulse AI is a frontend-only developer intelligence dashboard built with Angular, RxJS, Tailwind CSS, Axios, IndexedDB, and public APIs.

It helps analyze open-source repositories using GitHub repository data, Stack Overflow questions, DEV Community articles, Hacker News stories, local watchlists, browser cache, and client-side trend scoring.

## Tech Stack

- Angular latest
- Standalone Components
- RxJS
- Signals
- Tailwind CSS
- Axios
- Dexie / IndexedDB
- Vitest-based Angular testing
- Public APIs only
- No custom backend
- No database server

## Core Features

- GitHub repository search
- Repository detail page
- Repository health score
- Watchlist saved in IndexedDB
- Stack Overflow insights
- DEV Community trend signals
- Hacker News trend matching
- Offline-friendly cache foundation
- Settings page for tokens, cache, theme, and diagnostics
- Toast notifications
- Confirm dialogs
- Global error handling
- SEO metadata
- Lazy-loaded routes

## Public APIs Used

- GitHub REST API
- Stack Exchange API
- DEV Community / Forem API
- Hacker News Firebase API

## Frontend-Only Architecture

This project does not use:

- Custom backend APIs
- Node.js backend
- Express / NestJS
- Custom database server
- Firebase backend logic
- Supabase database features

All persistence is handled through:

- IndexedDB
- LocalStorage
- Browser cache patterns

## Installation

```bash
npm install
```
