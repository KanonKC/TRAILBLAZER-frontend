import { ExtendedWidget } from "@/services/widget.service";

export interface RandomDbdPerkClass {
    id: string;
    type: "survivor" | "killer";
    enabled: boolean;
    twitch_reward_id: string | null;
    maximum_random_size: number;
}

export interface RandomDbdPerkConfig {
    id: string;
    enabled: boolean;
    widget: ExtendedWidget;
    classes: RandomDbdPerkClass[];
    totalKillerPerks: number;
    totalSurvivorPerks: number;
}
