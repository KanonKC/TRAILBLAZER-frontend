import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Globe, Link2, Lock } from "lucide-react";

interface YouTubePrivacySelectProps {
    value: string;
    onValueChange: (value: string) => void;
    triggerClassName?: string;
}

export function YouTubePrivacySelect({ value, onValueChange, triggerClassName }: YouTubePrivacySelectProps) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className={cn(triggerClassName, "w-full")}>
                <SelectValue placeholder="เลือกสถานะ" />
            </SelectTrigger>
            <SelectContent position="popper">
                <SelectItem value="UNLISTED"><Link2 className="w-4 h-4" /> Unlisted (ไม่แสดงในรายการ)</SelectItem>
                <SelectItem value="PRIVATE"><Lock className="w-4 h-4" /> Private (ส่วนตัว)</SelectItem>
                <SelectItem value="PUBLIC"><Globe className="w-4 h-4" /> Public (สาธารณะ)</SelectItem>
            </SelectContent>
        </Select>
    );
}
