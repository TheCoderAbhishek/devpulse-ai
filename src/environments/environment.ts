export const environment = {
    production: true,
    appName: 'DevPulse AI',
    appVersion: '1.0.0',
    appDescription:
        'Frontend-only developer intelligence dashboard for GitHub, Stack Overflow, DEV Community, and Hacker News signals.',
    siteUrl: 'https://ashy-forest-00a623f00.7.azurestaticapps.net',
    repositoryUrl: 'https://github.com/TheCoderAbhishek/devpulse-ai',
    authorName: 'Abhishek Patil',
    enableDeveloperDiagnostics: false,
    enableConsoleLogging: false,
    enableServiceWorker: true,
    apiDefaults: {
        requestTimeoutMs: 15000,
        cacheTtlSeconds: 300,
    },
} as const;