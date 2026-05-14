export interface DashboardWidgetLayout {
    readonly widgetId: string;
    readonly title: string;
    readonly enabled: boolean;
    readonly order: number;
    readonly columnSpan: 1 | 2 | 3 | 4;
    readonly rowSpan?: number;
    readonly config?: Record<string, unknown>;
}

export interface DashboardLayout {
    readonly id: string;
    readonly name: string;
    readonly description?: string;
    readonly widgets: readonly DashboardWidgetLayout[];
    readonly isDefault: boolean;
    readonly createdAt: string;
    readonly updatedAt: string;
}