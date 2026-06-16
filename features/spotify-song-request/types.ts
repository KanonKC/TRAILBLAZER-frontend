import { ExtendedWidget } from "@/services/widget.service";

export interface SpotifySongRequestConfig {
    id: string;
    twitch_reward_id: string | null;
    twitch_bot_id: string | null;
    invalid_message: string | null;
    success_message: string | null;
    no_active_message: string | null;
    widget: ExtendedWidget;
}
