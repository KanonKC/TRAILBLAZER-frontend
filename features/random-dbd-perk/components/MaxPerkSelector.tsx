import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface MaxPerkSelectorProps {
    maxValue: number;
    currentValue: number;
    onCountChange: (value: number) => void;
    unit: "perk" | "page";
    onUnitChange: (unit: "perk" | "page") => void;
    className?: string;
    disabled?: boolean;
}

export function MaxPerkSelector({
    maxValue,
    currentValue,
    onCountChange,
    unit,
    onUnitChange,
    className,
    disabled
}: MaxPerkSelectorProps) {

    return (
        <div className={cn("space-y-2", className)}>
            <div className="space-y-1">
                <Label>จำนวนสูงสุด</Label>
                <p className="text-sm text-muted-foreground">
                    สำหรับผู้เล่นที่มี Perk ไม่ครบ กำหนดจำนวนสูงสุดที่ให้ระบบสุ่ม โดยเลือกนับเป็น Perk หรือหน้าในเกมได้
                </p>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex-1 pt-3">
                    <Slider
                        value={[currentValue]}
                        onValueChange={(val) => onCountChange(val[0])}
                        min={0}
                        max={maxValue}
                        step={1}
                        disabled={disabled}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground pt-1">
                        <span>0</span>
                        <span>{Math.floor(maxValue / 2)}</span>
                        <span>{maxValue}</span>
                    </div>
                </div>
                <Input
                    type="number"
                    min={0}
                    max={maxValue}
                    value={currentValue}
                    disabled={disabled}
                    className="w-20 font-mono tabular-nums"
                    onChange={(e) => {
                        const parsed = Number(e.target.value);
                        onCountChange(Number.isFinite(parsed) ? Math.min(maxValue, Math.max(0, Math.round(parsed))) : 0);
                    }}
                />
                <Select value={unit} onValueChange={(val: "perk" | "page") => onUnitChange(val)} disabled={disabled}>
                    <SelectTrigger className="w-24">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="perk">Perk</SelectItem>
                        <SelectItem value="page">หน้า</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
