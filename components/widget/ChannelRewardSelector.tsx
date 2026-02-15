
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { type TwitchCustomReward } from "@/services/twitch.service";
import { useEffect, useState } from "react";

interface ChannelRewardSelectorProps {
    value: string | null;
    onValueChange: (value: string | null) => void;
    rewards: TwitchCustomReward[];
    isLoading?: boolean;
    placeholder?: string;
    disabled?: boolean;
}

export function ChannelRewardSelector({
    value,
    onValueChange,
    rewards,
    isLoading,
    placeholder = "Select a reward",
    disabled
}: ChannelRewardSelectorProps) {
    const selectedReward = rewards.find(r => r.id === value);
    const selectedIcon = selectedReward?.image?.url_1x || selectedReward?.default_image?.url_1x;
    const [inputValue, setInputValue] = useState(selectedReward?.title || "");

    useEffect(() => {
        if (selectedReward) {
            setInputValue(selectedReward.title);
        } else if (!value) {
            setInputValue("");
        }
    }, [selectedReward, value]);

    return (
        <Combobox
            value={value}
            onValueChange={(val) => {
                onValueChange(val);
                const reward = rewards.find(r => r.id === val);
                if (reward) {
                    setInputValue(reward.title);
                }
            }}
            inputValue={inputValue}
            onInputValueChange={(val) => {
                const reward = rewards.find(r => r.id === val);
                setInputValue(reward ? reward.title : val);
            }}
        >
            <div className="relative">
                {selectedIcon && (
                    <img
                        src={selectedIcon}
                        alt="Selected reward icon"
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 object-contain pointer-events-none z-10"
                    />
                )}
                <ComboboxInput
                    placeholder={isLoading ? "Loading rewards..." : placeholder}
                    className={cn("w-full transition-all", selectedIcon && "pl-9")}
                    disabled={isLoading || disabled}
                />
            </div>
            <ComboboxContent>
                <ComboboxList>
                    <ComboboxItem value={null} textValue="None">None</ComboboxItem>
                    {isLoading ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">Loading rewards...</div>
                    ) : (
                        <>
                            {rewards.filter(reward => reward.title.toLowerCase().includes(inputValue.toLowerCase())).map((reward) => (
                                <ComboboxItem
                                    key={reward.id}
                                    value={reward.id}
                                    textValue={reward.title}
                                >
                                    <div className="flex items-center justify-between gap-2 w-full">
                                        <div className="flex items-center justify-start gap-2 max-w-[200px]">
                                            {(reward.image?.url_1x || reward.default_image?.url_1x) && (
                                                <img
                                                    src={reward.image?.url_1x || reward.default_image?.url_1x}
                                                    alt={reward.title}
                                                    className="w-4 h-4 object-contain shrink-0"
                                                />
                                            )}
                                            <span className="truncate">{reward.title}</span>
                                        </div>
                                        <span className="text-muted-foreground text-xs shrink-0">{reward.cost}</span>
                                    </div>
                                </ComboboxItem>
                            ))}
                        </>
                    )}
                </ComboboxList>
                {!isLoading && rewards.length === 0 && (
                    <ComboboxEmpty>No rewards found</ComboboxEmpty>
                )}
            </ComboboxContent>
        </Combobox>
    );
}
