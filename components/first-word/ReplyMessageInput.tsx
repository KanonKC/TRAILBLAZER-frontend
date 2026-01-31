import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ReplyMessageHelp } from "./ReplyMessageHelp";
import { cn } from "@/lib/utils";

interface ReplyMessageInputProps {
    value: string;
    onChange: (value: string) => void;
    variant?: "default" | "overlay";
}

export function ReplyMessageInput({ value, onChange, variant = "overlay" }: ReplyMessageInputProps) {
    const isOverlay = variant === "overlay";

    return (
        <div className="space-y-3">
            <Label htmlFor="qs_reply_message" className={cn(isOverlay ? "text-white" : "text-foreground")}>ข้อความตอบกลับ</Label>
            <Textarea
                id="qs_reply_message"
                placeholder="ยินดีต้อนรับสู่สตรีมนะ {{user_name}}!"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    "resize-none",
                    isOverlay
                        ? "bg-transparent border-white/20 text-white placeholder:text-white/40 focus-visible:ring-offset-0 focus-visible:ring-white/20"
                        : "bg-background border-input text-foreground"
                )}
                rows={3}
            />
            <ReplyMessageHelp variant={variant} />
        </div>
    );
}
