import { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ReplyMessageHelp } from "./ReplyMessageHelp";
import { cn } from "@/lib/utils";

interface ReplyMessageInputProps {
    value: string;
    onChange: (value: string) => void;
    variant?: "default" | "overlay";
    error?: string | null;
    hideLabel?: boolean;
}

export function ReplyMessageInput({ value, onChange, variant = "overlay", error, hideLabel }: ReplyMessageInputProps) {
    const isOverlay = variant === "overlay";
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleInsertVariable = (variable: string) => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newValue = value.substring(0, start) + variable + value.substring(end);
            onChange(newValue);

            // Set cursor position after the inserted variable
            requestAnimationFrame(() => {
                textarea.focus();
                const newCursorPos = start + variable.length;
                textarea.setSelectionRange(newCursorPos, newCursorPos);
            });
        } else {
            // Fallback: append to end
            onChange(value + variable);
        }
    };

    return (
        <div className="space-y-2">
            {
                !hideLabel && (<>
                    <Label htmlFor="qs_reply_message" className={cn(isOverlay ? "text-white" : "text-foreground")}>ข้อความตอบกลับ</Label>
                    <p className="text-sm text-muted-foreground">
                        พิมพ์ข้อความตอบกลับที่จะแสดงบนหน้าจอเมื่อมีคนส่งข้อความมา
                    </p>
                </>)
            }
            <div className="relative">
                <Textarea
                    ref={textareaRef}
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
                <div className="flex justify-between items-start absolute bottom-0 right-0 mr-2 mb-2">
                    {error ? (
                        <p className="text-sm text-red-500 font-medium">{error}</p>
                    ) : (
                        <div></div>
                    )}
                    <span className={cn("text-xs", isOverlay ? "text-white/50" : "text-muted-foreground", value.length > 500 ? "text-red-500" : "")}>
                        {value.length}/500
                    </span>
                </div>
            </div>
            <ReplyMessageHelp onInsertVariable={handleInsertVariable} />
        </div>
    );
}
