import { ExtendedWidget } from "@/services/widget.service";

export interface DBDKillerMaster {
    id: number;
    slug: string;
    title: string;
    image_url: string;
}

export interface RandomDBDKillerConfig {
    id: string;
    widget: ExtendedWidget;
    twitch_reward_id: string;
    killer_pool: string[];
}
