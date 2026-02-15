import { ChannelRewardSelector } from "@/components/widget/ChannelRewardSelector";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { RandomDbdPerkClass, PERKS_PER_PAGE } from "@/services/randomDbdPerk.service";
import { type TwitchCustomReward } from "@/services/twitch.service";
import { MaxPerkSelector } from "@/components/widget/MaxPerkSelector";

interface PerkConfigItemProps {
    item: RandomDbdPerkClass;
    index: number;
    rewards: TwitchCustomReward[];
    isLoading?: boolean;
    totalPerks: number;
    updatePerkClass: (index: number, key: keyof RandomDbdPerkClass, value: string | null | boolean | number) => void;
    unit: "perk" | "page";
    onUnitChange: (unit: "perk" | "page") => void;
}

export function PerkConfigItem({ item, index, rewards, isLoading, totalPerks, updatePerkClass, unit, onUnitChange }: PerkConfigItemProps) {
    const handleValueChange = (val: string | null) => {
        updatePerkClass(index, 'twitch_reward_id', val);
    };

    const maxValue = unit === 'perk' ? totalPerks : Math.ceil(totalPerks / PERKS_PER_PAGE);
    const effectiveMaxSize = Math.min(item.maximum_random_size, totalPerks);
    const currentValue = unit === 'perk' ? effectiveMaxSize : Math.ceil(effectiveMaxSize / PERKS_PER_PAGE);

    const handleCountChange = (val: number) => {
        let newValue = val;
        if (unit === 'page') {
            newValue = val * PERKS_PER_PAGE;
        }
        
        // Ensure within bounds relative to raw total
        if (newValue < 0) newValue = 0;
        if (newValue > totalPerks) newValue = totalPerks;

        updatePerkClass(index, 'maximum_random_size', newValue);
    };

    return (
        <div className="space-y-4 border p-4 rounded-xl relative">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "p-1.5 rounded-md",
                        item.type === 'survivor' ? "bg-blue-500/10 text-blue-500" : "bg-red-500/10 text-red-500"
                    )}>
                        {item.type === 'survivor' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
                        )}
                    </div>
                    <h3 className="text-lg font-semibold capitalize">{item.type} Perks</h3>
                </div>
                <Switch
                    checked={item.enabled}
                    onCheckedChange={(checked) => updatePerkClass(index, 'enabled', checked)}
                />
            </div>

            <div className={cn("grid gap-4 md:grid-cols-2 transition-opacity", !item.enabled && "opacity-50 pointer-events-none")}>
                <div className="space-y-2">
                    <Label>Twitch Reward</Label>
                    <ChannelRewardSelector
                        value={item.twitch_reward_id || null}
                        onValueChange={handleValueChange}
                        rewards={rewards}
                        isLoading={isLoading}
                    />
                </div>
                <MaxPerkSelector
                    maxValue={maxValue}
                    currentValue={currentValue}
                    onCountChange={handleCountChange}
                    unit={unit}
                    onUnitChange={onUnitChange}
                />
            </div>
        </div>
    );
}
