"use client";

import { useState } from "react";
import { useUser } from "@/components/user-context";
import { useTwitchRewards } from "@/hooks/use-twitch-rewards";
import { useWidgetLifecycleState } from "@/hooks/use-widget-lifecycle-state";
import { deleteWidget } from "@/services/widget.service";
import { tbToast } from "@/utils/tbToast";
import { reactiveRewardApi } from "../api/reactiveReward.api";
import { MAX_REACTIONS, WIDGET_SLUG } from "../constants";
import { describeError } from "../errors";
import type { Reaction, ReactionDraft, ReactiveRewardConfig } from "../types";

/** The sheet shows nothing, a blank form ("new") or the reaction being edited. */
export type EditingReaction = "new" | Reaction | null;

export function toDraft(reaction: Reaction, overrides: Partial<ReactionDraft> = {}): ReactionDraft {
    return {
        twitch_reward_id: reaction.twitch_reward_id,
        enabled: reaction.enabled,
        media_type: reaction.media_type,
        media_key: reaction.media_key ?? "",
        sound_key: reaction.sound_key,
        volume: reaction.volume,
        display_duration_ms: reaction.display_duration_ms,
        position: reaction.position,
        size_percent: reaction.size_percent,
        ...overrides,
    };
}

function upsert(reactions: Reaction[], saved: Reaction): Reaction[] {
    return reactions.some((reaction) => reaction.id === saved.id)
        ? reactions.map((reaction) => (reaction.id === saved.id ? saved : reaction))
        : [...reactions, saved];
}

/** Controller for the Reactive Reward settings page: the widget lifecycle plus its list of reactions. */
export function useReactiveReward(initialConfig: ReactiveRewardConfig | null) {
    const { user, isLoading: isUserLoading } = useUser();
    const lifecycle = useWidgetLifecycleState(initialConfig);
    const { config, setConfig, setIsEnabled, runSaving, runTesting, setActiveTab } = lifecycle;
    // The default of the hook hides every reward that does not ask the viewer for text, which is most of them
    const { rewards, isLoading: isRewardsLoading } = useTwitchRewards({ userInputRequired: false });
    const [editing, setEditing] = useState<EditingReaction>(null);
    const [busyReactionId, setBusyReactionId] = useState<string | null>(null);

    const reactions = config?.reactions ?? [];
    const canAddReaction = reactions.length < MAX_REACTIONS;
    const overlayUrl = typeof window !== "undefined" && user && config?.widget?.overlay_key
        ? `${window.location.origin}/overlays/${WIDGET_SLUG}/${user.id}?key=${config.widget.overlay_key}`
        : "";

    const rewardsById = new Map(rewards.map((reward) => [reward.id, reward]));
    const rewardUsedBy = (rewardId: string, exceptReactionId?: string) =>
        reactions.some((reaction) => reaction.twitch_reward_id === rewardId && reaction.id !== exceptReactionId);

    const handleEnable = async () => {
        if (!user) return;
        await runSaving(async () => {
            const data = await reactiveRewardApi.enable();
            tbToast.success({ title: "เปิดใช้งานสำเร็จ" });
            setConfig(data);
            setIsEnabled(data.widget?.enabled ?? false);
            setActiveTab("quick-start");
        }, "เปิดใช้งานไม่สำเร็จ", "Failed to enable");
    };

    const handleDelete = async () => {
        if (!config?.widget?.id) return;
        await runSaving(async () => {
            await deleteWidget(config.widget.id);
            tbToast.success({ title: "ลบวิดเจ็ตสำเร็จ" });
            setConfig(null);
            setIsEnabled(false);
            setEditing(null);
            setActiveTab("overview");
        }, "ลบวิดเจ็ตไม่สำเร็จ", "Failed to delete");
    };

    /** Resolves true when the reaction was saved, so the sheet knows whether to close. */
    const handleSaveReaction = async (draft: ReactionDraft, reactionId?: string): Promise<boolean> => {
        try {
            const saved = await reactiveRewardApi.saveReaction(draft, reactionId);
            setConfig((previous) => (previous ? { ...previous, reactions: upsert(previous.reactions, saved) } : previous));
            tbToast.success({ title: "บันทึก Reaction สำเร็จ" });
            return true;
        } catch (error) {
            console.error("Failed to save reaction", error);
            tbToast.error({ title: "บันทึก Reaction ไม่สำเร็จ", description: describeError(error), error: (error as { response?: { data?: unknown } }).response?.data });
            return false;
        }
    };

    const handleToggleReaction = async (reaction: Reaction, enabled: boolean) => {
        setBusyReactionId(reaction.id);
        try {
            await handleSaveReaction(toDraft(reaction, { enabled }), reaction.id);
        } finally {
            setBusyReactionId(null);
        }
    };

    const handleDeleteReaction = async (reactionId: string): Promise<boolean> => {
        try {
            await reactiveRewardApi.deleteReaction(reactionId);
            setConfig((previous) => (previous ? { ...previous, reactions: previous.reactions.filter((reaction) => reaction.id !== reactionId) } : previous));
            tbToast.success({ title: "ลบ Reaction สำเร็จ" });
            return true;
        } catch (error) {
            console.error("Failed to delete reaction", error);
            tbToast.error({ title: "ลบ Reaction ไม่สำเร็จ", description: describeError(error), error: (error as { response?: { data?: unknown } }).response?.data });
            return false;
        }
    };

    const handleTestReaction = async (reactionId: string) => {
        setBusyReactionId(reactionId);
        await runTesting(async () => {
            try {
                const result = await reactiveRewardApi.testReaction(reactionId);
                if (!result.enqueued) {
                    tbToast.error({ title: "ทดสอบไม่สำเร็จ", description: result.reason === "queue_full" ? "คิวของโอเวอร์เลย์เต็ม ลองใหม่อีกครั้งในอีกสักครู่" : "ส่งไปที่โอเวอร์เลย์ไม่ได้ ลองใหม่อีกครั้ง" });
                    return;
                }
                tbToast.success({ title: "ส่งทดสอบแล้ว", description: "ดูผลได้ที่โอเวอร์เลย์ใน OBS" });
            } catch (error) {
                console.error("Test failed", error);
                tbToast.error({ title: "ทดสอบไม่สำเร็จ", description: describeError(error), error: (error as { response?: { data?: unknown } }).response?.data });
            }
        }, "ทดสอบไม่สำเร็จ", "Test failed");
        setBusyReactionId(null);
    };

    return {
        ...lifecycle,
        user,
        isUserLoading,
        reactions,
        canAddReaction,
        overlayUrl,
        rewards,
        rewardsById,
        isRewardsLoading,
        rewardUsedBy,
        editing,
        busyReactionId,
        openNewReaction: () => setEditing("new"),
        openReaction: (reaction: Reaction) => setEditing(reaction),
        closeReaction: () => setEditing(null),
        handleEnable,
        handleDelete,
        handleSaveReaction,
        handleToggleReaction,
        handleDeleteReaction,
        handleTestReaction,
    };
}
