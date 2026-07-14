import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { RandomDBDKillerAnimationStyle } from "../types";

interface AnimationStyleSelectProps {
    value: RandomDBDKillerAnimationStyle;
    onValueChange: (value: RandomDBDKillerAnimationStyle) => void;
    triggerClassName?: string;
}

export function AnimationStyleSelect({ value, onValueChange, triggerClassName }: AnimationStyleSelectProps) {
    return (
        <Select value={value} onValueChange={(v) => onValueChange(v as RandomDBDKillerAnimationStyle)}>
            <SelectTrigger className={cn(triggerClassName, "w-full")}>
                <SelectValue placeholder="เลือกรูปแบบการสุ่ม" />
            </SelectTrigger>
            <SelectContent position="popper">
                {/* <SelectItem value="slot">Slot Machine (เลื่อนขึ้นลง)</SelectItem> */}
                {/* <SelectItem value="flip">สลับเร็ว (Flip)</SelectItem> */}
                {/* <SelectItem value="roulette">วงล้อ (Roulette)</SelectItem> */}
                <SelectItem value="frame">รูปแบบปกติ (Default)</SelectItem>
            </SelectContent>
        </Select>
    );
}
