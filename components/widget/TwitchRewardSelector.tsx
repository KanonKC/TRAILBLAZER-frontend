import { ChannelRewardSelector } from "./ChannelRewardSelector";
import { useTwitchRewards } from "@/hooks/use-twitch-rewards";

interface TwitchRewardSelectorProps {
    value: string | null;
    onValueChange: (value: string | null) => void;
    placeholder?: string;
    disabled?: boolean;
    userInputRequired?: boolean;
}

/**
 * Smart component for selecting Twitch custom rewards.
 * Handles its own data fetching using the useTwitchRewards hook.
 */
export function TwitchRewardSelector({
    value,
    onValueChange,
    placeholder,
    disabled,
    userInputRequired = false
}: TwitchRewardSelectorProps) {
    const { rewards, isLoading } = useTwitchRewards({ userInputRequired });
    return (
        <ChannelRewardSelector
            value={value}
            onValueChange={onValueChange}
            rewards={rewards}
            isLoading={isLoading}
            placeholder={placeholder}
            disabled={disabled}
        />
    );
}
