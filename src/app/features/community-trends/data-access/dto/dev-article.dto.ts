export interface DevUserDto {
    readonly name?: string;
    readonly username?: string;
    readonly twitter_username?: string | null;
    readonly github_username?: string | null;
    readonly website_url?: string | null;
    readonly profile_image?: string;
    readonly profile_image_90?: string;
}

export interface DevArticleDto {
    readonly id: number;
    readonly title: string;
    readonly description: string;
    readonly readable_publish_date: string;
    readonly slug: string;
    readonly path: string;
    readonly url: string;
    readonly comments_count: number;
    readonly public_reactions_count: number;
    readonly collection_id?: number | null;
    readonly published_timestamp: string;
    readonly positive_reactions_count?: number;
    readonly cover_image?: string | null;
    readonly social_image?: string;
    readonly canonical_url?: string;
    readonly created_at: string;
    readonly edited_at?: string | null;
    readonly crossposted_at?: string | null;
    readonly published_at: string;
    readonly last_comment_at: string;
    readonly reading_time_minutes: number;
    readonly tag_list: readonly string[];
    readonly tags: string;
    readonly user: DevUserDto;
}