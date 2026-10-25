import { Button } from "@/components/ui/button";
import { Loader2, Play } from "lucide-react";
import WidgetEnabledBadge from "./WidgetEnabledBadge";

interface WidgetStatusControlProps {
    isEnabled: boolean;
    isSaving: boolean;
    onEnable: () => void;
}

export function WidgetStatusControl({ isEnabled, isSaving, onEnable }: WidgetStatusControlProps) {
    return (
        <div className="space-y-2">
            <p className="text-sm text-muted-foreground">กดปุ่มเพื่อเปิดใช้งาน</p>
            {isEnabled ? (
                <WidgetEnabledBadge />
            ) : (
                <Button onClick={onEnable} disabled={isSaving} size="sm" className="gap-2">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    {isSaving ? "กำลังเปิดใช้งาน..." : "เปิดใช้งาน"}
                </Button>
            )}
        </div>
    );
}
