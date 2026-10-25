
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { Gift, Loader2 } from "lucide-react";
import { useState } from "react";

/** The reward fields the selector reads; `TwitchCustomReward` and the random-pool `Reward` both fit. */
export interface SelectableReward {
    id: string;
    title: string;
    cost: number;
    background_color?: string;
    image?: { url_1x: string } | null;
    default_image?: { url_1x: string } | null;
}

/** Twitch reward icon on the reward's own background color, with a gift glyph when Twitch has no image. */
export function RewardIcon({ reward, className }: { reward?: SelectableReward | null; className?: string }) {
    const imageUrl = reward?.image?.url_1x || reward?.default_image?.url_1x;
    return (
        <span
            className={cn("bg-secondary inline-flex size-6 shrink-0 items-center justify-center rounded-sm", className)}
            style={reward?.background_color ? { backgroundColor: reward.background_color } : undefined}
        >
            {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="" className="size-[70%] object-contain" />
            ) : (
                <Gift className="size-3 text-muted-foreground" aria-hidden="true" />
            )}
        </span>
    );
}

interface ChannelRewardSelectorProps {
    value: string | null;
    onValueChange: (value: string | null) => void;
    rewards: SelectableReward[];
    isLoading?: boolean;
    placeholder?: string;
    disabled?: boolean;
    /** Show a "None" entry that clears the value. Turn off when a reward is required. */
    allowNone?: boolean;
    /** A reason a reward cannot be picked (for example it is used elsewhere); the item is disabled and shows the note. */
    getRewardDisabledNote?: (reward: SelectableReward) => string | null | undefined;
}

export function ChannelRewardSelector({
    value,
    onValueChange,
    rewards,
    isLoading,
    placeholder = "เลือกแต้มช่อง",
    disabled,
    allowNone = true,
    getRewardDisabledNote
}: ChannelRewardSelectorProps) {
    const selectedReward = rewards.find(r => r.id === value);
    const [isOpen, setIsOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const inputValue = isOpen ? searchInput : (selectedReward?.title ?? "");

    return (
        <Combobox
            value={value}
            onValueChange={(val) => {
                onValueChange(val);
                setSearchInput("");
            }}
            inputValue={inputValue}
            onInputValueChange={(val) => {
                if (isOpen) setSearchInput(val);
            }}
            onOpenChange={(open) => {
                setIsOpen(open);
                if (open) setSearchInput("");
            }}
        >
            <div className="relative">
                {isLoading && (
                    <Loader2 className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground pointer-events-none z-10" />
                )}
                {!isLoading && selectedReward && !isOpen && (
                    <RewardIcon
                        reward={selectedReward}
                        className="absolute left-2 top-1/2 -translate-y-1/2 size-5 pointer-events-none z-10"
                    />
                )}
                <ComboboxInput
                    placeholder={isLoading ? "กำลังโหลดแต้มช่อง..." : placeholder}
                    className={cn("w-full transition-all", (isLoading || (selectedReward && !isOpen)) && "[&_input]:pl-9")}
                    disabled={isLoading || disabled}
                />
            </div>
            <ComboboxContent>
                <ComboboxList>
                    {allowNone && <ComboboxItem value={null} textValue="None">None</ComboboxItem>}
                    {isLoading ? (
                        <div className="p-2 text-sm text-muted-foreground text-center flex items-center justify-center gap-2"><Loader2 className="size-4 animate-spin" />กำลังโหลดแต้มช่อง...</div>
                    ) : (
                        <>
                            {rewards.filter(reward => reward.title.toLowerCase().includes(searchInput.toLowerCase())).map((reward) => {
                                const disabledNote = getRewardDisabledNote?.(reward);
                                return (
                                <ComboboxItem
                                    key={reward.id}
                                    value={reward.id}
                                    textValue={reward.title}
                                    disabled={!!disabledNote}
                                >
                                    <div className="flex items-center justify-between gap-2 w-full">
                                        <div className="flex items-center justify-start gap-2 min-w-0">
                                            <RewardIcon reward={reward} />
                                            <span className="grid min-w-0">
                                                <span className="truncate">{reward.title}</span>
                                                {disabledNote && <span className="truncate text-xs text-muted-foreground">{disabledNote}</span>}
                                            </span>
                                        </div>
                                        <span className="text-muted-foreground text-xs tabular-nums shrink-0">{reward.cost.toLocaleString()}</span>
                                    </div>
                                </ComboboxItem>
                                );
                            })}
                        </>
                    )}
                </ComboboxList>
                {!isLoading && rewards.length === 0 && (
                    <ComboboxEmpty>ไม่พบแต้มช่อง</ComboboxEmpty>
                )}
            </ComboboxContent>
        </Combobox >
    );
}
