export const environment = {
    production: false,
    appName: 'DevPulse AI',
    appVersion: '1.0.0-dev',
    appDescription:
        'Frontend-only developer intelligence dashboard for GitHub, Stack Overflow, DEV Community, and Hacker News signals.',
    siteUrl: 'http://localhost:4200',
    repositoryUrl: 'https://github.com/YOUR_USERNAME/devpulse-ai',
    authorName: 'Abhishek Patil',
    enableDeveloperDiagnostics: true,
    enableConsoleLogging: true,
    enableServiceWorker: false,
    apiDefaults: {
        requestTimeoutMs: 15000,
        cacheTtlSeconds: 300,
    },
} as const;