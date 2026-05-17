export type HackerNewsItemType =
    | 'job'
    | 'story'
    | 'comment'
    | 'poll'
    | 'pollopt';

export interface HackerNewsItemDto {
    readonly id: number;
    readonly deleted?: boolean;
    readonly type?: HackerNewsItemType;
    readonly by?: string;
    readonly time?: number;
    readonly text?: string;
    readonly dead?: boolean;
    readonly parent?: number;
    readonly poll?: number;
    readonly kids?: readonly number[];
    readonly url?: string;
    readonly score?: number;
    readonly title?: string;
    readonly parts?: readonly number[];
    readonly descendants?: number;
}