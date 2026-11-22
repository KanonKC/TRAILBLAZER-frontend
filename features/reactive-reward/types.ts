import type { ExtendedWidget } from "@/services/widget.service";

export type ReactionMediaType = "IMAGE" | "AUDIO" | "VIDEO";

export type ReactionPosition =
    | "TOP_LEFT" | "TOP_CENTER" | "TOP_RIGHT"
    | "MIDDLE_LEFT" | "CENTER" | "MIDDLE_RIGHT"
    | "BOTTOM_LEFT" | "BOTTOM_CENTER" | "BOTTOM_RIGHT";

/** The stored file a reaction points at, as the backend joins it in. */
export interface ReactionFile {
    id: string;
    key: string;
    name: string;
    type: string;
    size_kb: number;
    duration_ms: number | null;
}

export interface Reaction {
    id: string;
    twitch_reward_id: string;
    twitch_reward_title: string;
    enabled: boolean;
    sort_order: number;
    media_type: ReactionMediaType;
    /** Null once the file was deleted from the library. */
    media_key: string | null;
    media_file: ReactionFile | null;
    media_url: string | null;
    sound_key: string | null;
    sound_file: ReactionFile | null;
    sound_url: string | null;
    /** 0-100 */
    volume: number;
    display_duration_ms: number;
    position: ReactionPosition;
    size_percent: number;
}

export interface ReactiveRewardConfig {
    id: string;
    widget_id: string;
    widget: ExtendedWidget;
    reactions: Reaction[];
    /** Switching the widget on is free; points are charged by how many Reactions are active. */
    quota: ReactiveRewardQuota;
}

export interface ReactiveRewardQuota {
    active_count: number;
    points_needed: number;
    points_available: number;
    /** Most Reactions that can be on at once with the points available to this widget. */
    active_limit: number;
    max_reactions: number;
}

/** What is sent when a reaction is saved. */
export interface ReactionDraft {
    twitch_reward_id: string;
    enabled: boolean;
    media_type: ReactionMediaType;
    media_key: string;
    sound_key: string | null;
    volume: number;
    display_duration_ms: number;
    position: ReactionPosition;
    size_percent: number;
}

/** One item on the overlay's event stream. */
export interface ReactionPlayEvent {
    jobId: string;
    /** Queue ceiling: the longest the backend holds the queue if no ack arrives. */
    duration_ms: number;
    /** How long the overlay keeps the item up. */
    display_ms: number;
    reaction_id: string;
    redemption_id: string;
    is_test: boolean;
    media_type: ReactionMediaType;
    media_url: string;
    sound_url: string | null;
    volume: number;
    position: ReactionPosition;
    size_percent: number;
}

export interface TestReactionResult {
    enqueued: boolean;
    reason?: "duplicate" | "queue_full" | "error";
}
