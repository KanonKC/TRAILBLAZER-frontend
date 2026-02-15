import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { RandomDbdPerkClass } from "@/services/randomDbdPerk.service";
import { type TwitchCustomReward } from "@/services/twitch.service";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";

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
    const selectedReward = rewards.find(r => r.id === item.twitch_reward_id);
    const selectedIcon = selectedReward?.image?.url_1x || selectedReward?.default_image?.url_1x;
    const [inputValue, setInputValue] = useState(selectedReward?.title || "");

    useEffect(() => {
        if (selectedReward) {
            setInputValue(selectedReward.title);
        } else if (!item.twitch_reward_id) {
            setInputValue("");
        }
    }, [selectedReward, item.twitch_reward_id]);

    const handleValueChange = (val: string | null) => {
        updatePerkClass(index, 'twitch_reward_id', val);
        const reward = rewards.find(r => r.id === val);
        if (reward) {
            setInputValue(reward.title);
        }
    };

    const maxValue = unit === 'perk' ? totalPerks : Math.ceil(totalPerks / 15);
    const effectiveMaxSize = Math.min(item.maximum_random_size, totalPerks);
    const currentValue = unit === 'perk' ? effectiveMaxSize : Math.ceil(effectiveMaxSize / 15);

    const handleCountChange = (val: number) => {
        let newValue = val;
        if (unit === 'page') {
            newValue = val * 15;
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
                    <Combobox
                        value={item.twitch_reward_id || null}
                        onValueChange={handleValueChange}
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
                                placeholder={isLoading ? "Loading rewards..." : "Select a reward"}
                                className={cn("w-full transition-all", selectedIcon && "pl-9")}
                                disabled={isLoading}
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
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Label>จำนวนสูงสุด</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-3">
                                    <p className="text-sm">สำหรับผู้เล่นที่มี Perk ไม่ครบ สามารถกำหนดจำนวน Perk สูงสุดที่จะให้ระบบสุ่มได้</p>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="0"
                                max={maxValue}
                                value={currentValue}
                                onChange={(e) => {
                                    let val = parseInt(e.target.value);
                                    if (isNaN(val)) val = 0;
                                    handleCountChange(val);
                                }}
                                className="w-16 h-8 text-sm text-center bg-transparent border rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            <Select value={unit} onValueChange={(val: "perk" | "page") => onUnitChange(val)}>
                                <SelectTrigger className="h-8 w-[80px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="perk">Perk</SelectItem>
                                    <SelectItem value="page">Page</SelectItem>
                                </SelectContent>
                            </Select>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-3">
                                    <p className="text-sm">เลือกหน่วยการนับเป็น &apos;Perk&apos; (จำนวนชิ้น) หรือ &apos;Page&apos; (หน้าในเกม) เพื่อให้ง่ายต่อการตั้งค่าตามความถนัด</p>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="pt-2 px-1">
                        <input
                            type="range"
                            min="0"
                            max={maxValue}
                            step="1"
                            className="w-full accent-emerald-500 cursor-pointer"
                            value={currentValue}
                            onChange={(e) => handleCountChange(parseInt(e.target.value))}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>0</span>
                            <span>{Math.floor(maxValue / 2)}</span>
                            <span>{maxValue}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
