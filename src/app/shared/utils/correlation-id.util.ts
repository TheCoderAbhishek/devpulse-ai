export function createCorrelationId(prefix = 'devpulse'): string {
    return `${prefix}-${crypto.randomUUID()}`;
}