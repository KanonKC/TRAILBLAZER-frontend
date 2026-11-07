import { TwitchRewardSelector } from "@/components/widget/TwitchRewardSelector";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Flame, Users } from "lucide-react";
import { RandomDbdPerkClass } from "@/features/random-dbd-perk/types";
import { PERKS_PER_PAGE } from "@/features/random-dbd-perk/hooks/useRandomDbdPerk";
import { MaxPerkSelector } from "./MaxPerkSelector";

interface PerkConfigItemProps {
    item: RandomDbdPerkClass;
    index: number;
    totalPerks: number;
    updatePerkClass: (index: number, key: keyof RandomDbdPerkClass, value: string | null | boolean | number) => void;
    unit: "perk" | "page";
    onUnitChange: (unit: "perk" | "page") => void;
}

export function PerkConfigItem({ item, index, totalPerks, updatePerkClass, unit, onUnitChange }: PerkConfigItemProps) {
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

    const sideName = item.type === 'survivor' ? "Survivor" : "Killer";
    const SideIcon = item.type === 'survivor' ? Users : Flame;
    const enabledSwitchId = `perk-enabled-${item.type}`;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2">
                <SideIcon className={cn("w-5 h-5", item.type === 'survivor' ? "text-survivor" : "text-killer")} />
                <h3 className="text-lg font-semibold">Perk ของ {sideName}</h3>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div className="space-y-1">
                    <Label htmlFor={enabledSwitchId}>เปิดการสุ่ม Perk ของ {sideName}</Label>
                    <p className="text-sm text-muted-foreground">ผู้ชมแลกแต้มช่องเพื่อสุ่ม Perk ของฝั่งนี้ได้</p>
                </div>
                <Switch
                    id={enabledSwitchId}
                    checked={item.enabled}
                    onCheckedChange={(checked) => updatePerkClass(index, 'enabled', checked)}
                />
            </div>

            <div className={cn("space-y-6 transition-opacity", !item.enabled && "opacity-50")}>
                <div className="space-y-2">
                    <div className="space-y-1">
                        <Label>แต้มช่อง</Label>
                        <p className="text-sm text-muted-foreground">Channel Points Reward บน Twitch ที่ผู้ชมแลกเพื่อสุ่ม Perk ของ {sideName}</p>
                    </div>
                    <TwitchRewardSelector
                        value={item.twitch_reward_id || null}
                        onValueChange={handleValueChange}
                        userInputRequired={false}
                        disabled={!item.enabled}
                    />
                </div>
                <MaxPerkSelector
                    maxValue={maxValue}
                    currentValue={currentValue}
                    onCountChange={handleCountChange}
                    unit={unit}
                    onUnitChange={onUnitChange}
                    disabled={!item.enabled}
                />
            </div>
        </div>
    );
}
