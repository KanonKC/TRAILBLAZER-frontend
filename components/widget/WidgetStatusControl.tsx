import { Button } from "@/components/ui/button";
import { Check, Play } from "lucide-react";

interface WidgetStatusControlProps {
    isEnabled: boolean;
    isSaving: boolean;
    onEnable: () => void;
}

export function WidgetStatusControl({ isEnabled, isSaving, onEnable }: WidgetStatusControlProps) {
    return (
        <div className="space-y-2">
            <p className="text-sm text-white/70">กดปุ่มเพื่อเปิดใช้งาน</p>
            {isEnabled ? (
                <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-3 py-2 rounded-md border border-green-500/20 w-fit">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">เปิดใช้งานแล้ว</span>
                </div>
            ) : (
                <Button onClick={onEnable} disabled={isSaving} size="sm" className="gap-2">
                    <Play className="w-4 h-4" />
                    เปิดใช้งาน
                </Button>
            )}
        </div>
    );
}
