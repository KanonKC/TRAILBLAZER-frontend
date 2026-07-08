import { ExtendedWidget } from "@/services/widget.service";

export interface DBDKillerMaster {
    id: number;
    slug: string;
    title: string;
    image_url: string;
}

export type RandomDBDKillerAnimationStyle = "slot" | "flip" | "roulette";

export interface RandomDBDKillerConfig {
    id: string;
    widget: ExtendedWidget;
    twitch_reward_id: string;
    killer_pool: string[];
    animation_style: RandomDBDKillerAnimationStyle;
}
