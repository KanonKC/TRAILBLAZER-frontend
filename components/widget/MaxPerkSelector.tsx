import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface MaxPerkSelectorProps {
    maxValue: number;
    currentValue: number;
    onCountChange: (value: number) => void;
    unit: "perk" | "page";
    onUnitChange: (unit: "perk" | "page") => void;
    className?: string;
}

export function MaxPerkSelector({
    maxValue,
    currentValue,
    onCountChange,
    unit,
    onUnitChange,
    className
}: MaxPerkSelectorProps) {

    return (
        <div className={cn("space-y-2", className)}>
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
                            // Ensure the manual input respects the bounds
                            if (val > maxValue) val = maxValue;
                            if (val < 0) val = 0;
                            onCountChange(val);
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
                    onChange={(e) => onCountChange(parseInt(e.target.value))}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span>
                    <span>{Math.floor(maxValue / 2)}</span>
                    <span>{maxValue}</span>
                </div>
            </div>
        </div>
    );
}
