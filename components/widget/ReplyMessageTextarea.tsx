import { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ReplyMessageHelp, VariableItem } from "./ReplyMessageHelp";
import { cn } from "@/lib/utils";

interface ReplyMessageTextareaProps {
    value: string;
    onChange: (value: string) => void;
    variant?: "default" | "overlay";
    error?: string | null;
    variables?: VariableItem[];
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
    defaultOpenHelp?: boolean;
    name?: string;
}

export function ReplyMessageTextarea({ value, onChange, variant = "overlay", error, variables=[], placeholder, rows = 3, disabled=false, defaultOpenHelp = false, name }: ReplyMessageTextareaProps) {
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
            <div className="relative">
                <Textarea
                    disabled={disabled}
                    placeholder={placeholder}
                    ref={textareaRef}
                    id="qs_reply_message"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={cn(
                        "resize-none",
                        isOverlay
                            ? "bg-transparent border-white/20 text-white placeholder:text-white/40 focus-visible:ring-offset-0 focus-visible:ring-white/20"
                            : "bg-background border-input text-foreground"
                    )}
                    rows={rows}
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
            { variables.length > 0 && <ReplyMessageHelp onInsertVariable={handleInsertVariable} variables={variables} defaultOpen={defaultOpenHelp} />}
        </div>
    );
}
