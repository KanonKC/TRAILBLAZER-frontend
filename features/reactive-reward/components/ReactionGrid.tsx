"use client";

import { CircleAlert, CircleCheck, CirclePause, Film, ImageIcon, Music, Pencil, Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { SelectableReward } from "@/components/widget/ChannelRewardSelector";
import { RewardLabel } from "@/components/widget/RewardLabel";
import { MEDIA_TYPE_LABELS } from "../constants";
import type { Reaction, ReactionMediaType } from "../types";
import { MediaThumb } from "./MediaThumb";

const TYPE_ICONS: Record<ReactionMediaType, typeof ImageIcon> = { IMAGE: ImageIcon, AUDIO: Music, VIDEO: Film };

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

    return (
        <ul className="space-y-3">
            {reactions.map((reaction) => {
                const reward = rewardsById.get(reaction.twitch_reward_id);
                const problem = problemOf(reaction, rewardsLoaded && !reward);
                const busy = busyReactionId === reaction.id;
                const TypeIcon = TYPE_ICONS[reaction.media_type];
                return (
                    <li key={reaction.id} className="bg-card hover:bg-secondary flex items-center gap-4 rounded-lg border p-3">
                        <MediaThumb mediaType={reaction.media_type} url={reaction.media_url} missing={!reaction.media_file} className="size-16 shrink-0" />
                        <div className="min-w-0 flex-1 space-y-1">
                            <RewardLabel
                                reward={reward ?? { id: reaction.twitch_reward_id, title: reaction.twitch_reward_title, cost: 0 }}
                                showCost={!!reward}
                                className="font-medium"
                            />
                            <p className="text-muted-foreground flex min-w-0 items-center gap-1.5 text-sm">
                                <TypeIcon className="size-4 shrink-0" aria-hidden="true" />
                                <span className="shrink-0">{MEDIA_TYPE_LABELS[reaction.media_type]}</span>
                                {reaction.media_file && <span className="truncate">· {reaction.media_file.name}</span>}
                            </p>
                            {problem ? (
                                <p className="text-destructive flex items-center gap-1.5 text-sm">
                                    <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
                                    {problem}
                                </p>
                            ) : reaction.enabled ? (
                                <p className="text-success flex items-center gap-1.5 text-sm">
                                    <CircleCheck className="size-4 shrink-0" aria-hidden="true" />
                                    เปิดใช้งาน
                                </p>
                            ) : (
                                <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
                                    <CirclePause className="size-4 shrink-0" aria-hidden="true" />
                                    ปิดอยู่
                                </p>
                            )}
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <Switch
                                aria-label={`เปิดใช้งาน ${reaction.twitch_reward_title}`}
                                checked={reaction.enabled}
                                disabled={busy}
                                onCheckedChange={(checked) => onToggle(reaction, checked)}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                aria-label={`ทดสอบ ${reaction.twitch_reward_title}`}
                                disabled={busy || !reaction.media_file}
                                onClick={() => onTest(reaction.id)}
                            >
                                <Play />
                            </Button>
                            <Button type="button" variant="outline" size="icon" aria-label={`แก้ไข ${reaction.twitch_reward_title}`} onClick={() => onEdit(reaction)}>
                                <Pencil />
                            </Button>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
