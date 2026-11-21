"use client";

import { ArrowRight, CircleAlert, Pencil, Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { SelectableReward } from "@/components/widget/ChannelRewardSelector";
import { ChannelPointsCost } from "@/components/icons/channel-points";
import { RewardLabel } from "@/components/widget/RewardLabel";
import { MEDIA_TYPE_ICONS, MEDIA_TYPE_LABELS } from "../constants";
import type { Reaction } from "../types";
import { MediaThumb } from "./MediaThumb";

interface ReactionGridProps {
    reactions: Reaction[];
    rewardsById: Map<string, SelectableReward>;
    /** False until the channel's rewards have loaded, so a slow load is not mistaken for a deleted reward. */
    rewardsLoaded: boolean;
    busyReactionId: string | null;
    canAdd: boolean;
    onAdd: () => void;
    onEdit: (reaction: Reaction) => void;
    onToggle: (reaction: Reaction, enabled: boolean) => void;
    onTest: (reactionId: string) => void;
}

/** What is wrong with a reaction that will not play, or null. Always shown as an icon and a word, never colour alone. */
function problemOf(reaction: Reaction, rewardMissing: boolean): string | null {
    if (!reaction.media_file) return "ไฟล์ถูกลบออกจากคลังแล้ว";
    if (rewardMissing) return "ไม่พบแต้มช่องนี้บน Twitch";
    return null;
}

export function ReactionGrid({ reactions, rewardsById, rewardsLoaded, busyReactionId, canAdd, onAdd, onEdit, onToggle, onTest }: ReactionGridProps) {
    if (reactions.length === 0) {
        return (
            <div className="space-y-3 py-8 text-center">
                <p className="text-muted-foreground text-sm">ยังไม่มี Reaction</p>
                <Button type="button" onClick={onAdd} disabled={!canAdd}>
                    <Plus />
                    เพิ่ม Reaction แรก
                </Button>
            </div>
        );
    }

    // By channel point cost from low to high. A reward not found on Twitch has no cost, so it goes last.
    const sortedReactions = [...reactions].sort((first, second) => {
        const firstCost = rewardsById.get(first.twitch_reward_id)?.cost ?? Number.POSITIVE_INFINITY;
        const secondCost = rewardsById.get(second.twitch_reward_id)?.cost ?? Number.POSITIVE_INFINITY;
        if (firstCost === secondCost) return 0;
        return firstCost < secondCost ? -1 : 1;
    });

    return (
        <ul className="space-y-2">
            {sortedReactions.map((reaction) => {
                const reward = rewardsById.get(reaction.twitch_reward_id);
                const problem = problemOf(reaction, rewardsLoaded && !reward);
                const busy = busyReactionId === reaction.id;
                const TypeIcon = MEDIA_TYPE_ICONS[reaction.media_type];
                return (
                    <li key={reaction.id} className="bg-card hover:bg-secondary flex items-center gap-3 rounded-lg border px-3 py-2">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                            <RewardLabel
                                reward={reward ?? { id: reaction.twitch_reward_id, title: reaction.twitch_reward_title, cost: 0 }}
                                className="min-w-0 flex-1 font-medium"
                            />
                            {problem ? (
                                <span className="text-destructive flex min-w-0 items-center gap-1 text-sm" title={problem}>
                                    <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
                                    <span className="truncate">{problem}</span>
                                </span>
                            ) : null}
                            <span className="flex w-16 shrink-0 justify-start">
                                {reward && <ChannelPointsCost amount={reward.cost} className="text-muted-foreground text-sm" />}
                            </span>
                        </div>
                        <ArrowRight className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
                        <div className="flex min-w-0 basis-[30%] shrink-0 items-center gap-3" title={reaction.media_file?.name}>
                            <MediaThumb mediaType={reaction.media_type} url={reaction.media_url} missing={!reaction.media_file} className="size-10 shrink-0" iconClassName="size-5" />
                            <span className="text-muted-foreground flex min-w-0 items-center gap-1.5 text-sm">
                                <span className="sr-only">{MEDIA_TYPE_LABELS[reaction.media_type]}</span>
                                <TypeIcon className="size-4 shrink-0" aria-hidden="true" />
                                {reaction.media_file && <span className="truncate">{reaction.media_file.name}</span>}
                            </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                            <Switch
                                aria-label={`เปิดใช้งาน ${reaction.twitch_reward_title}`}
                                checked={reaction.enabled}
                                disabled={busy}
                                onCheckedChange={(checked) => onToggle(reaction, checked)}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon-xs"
                                className="size-7 [&_svg:not([class*='size-'])]:size-4"
                                aria-label={`ทดสอบ ${reaction.twitch_reward_title}`}
                                disabled={busy || !reaction.media_file}
                                onClick={() => onTest(reaction.id)}
                            >
                                <Play />
                            </Button>
                            <Button type="button" variant="outline" size="icon-xs" className="size-7 [&_svg:not([class*='size-'])]:size-4" aria-label={`แก้ไข ${reaction.twitch_reward_title}`} onClick={() => onEdit(reaction)}>
                                <Pencil />
                            </Button>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
