export interface ClipShoutoutConfig {
    id: string;
    twitch_id: string;
    owner_id: string;
    reply_message: string | null;
    delay_ms: number;
    enabled: boolean;
    twitch_bot_id?: string | null;
    enabled_clip?: boolean;
    enabled_highlight_only?: boolean;
    widget: {
        id: string;
        overlay_key: string;
        enabled: boolean;
    }
}
