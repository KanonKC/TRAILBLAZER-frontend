export interface DropImageConfig {
    id: string;
    enabled: boolean;
    enabled_moderation: boolean;
    display_duration: number;
    twitch_reward_id: string | null;
    twitch_bot_id: string | null;
    invalid_message: string | null;
    not_image_message: string | null;
    contain_mature_message: string | null;
    widget: {
        id: string;
        overlay_key: string;
        enabled: boolean;
    };
}
