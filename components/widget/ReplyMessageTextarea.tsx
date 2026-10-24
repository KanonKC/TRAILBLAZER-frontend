import { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ReplyMessageHelp, VariableItem } from "./ReplyMessageHelp";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface ReplyMessageTextareaProps {
    value: string;
    onChange: (value: string) => void;
    error?: string | null;
    variables?: VariableItem[];
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
    defaultOpenHelp?: boolean;
    name?: string;
}

export function ReplyMessageTextarea({ value, onChange, error, variables=[], placeholder, rows = 3, disabled=false, defaultOpenHelp = false, name }: ReplyMessageTextareaProps) {
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
                    aria-invalid={error ? true : undefined}
                    className="resize-none pb-8"
                    rows={rows}
                />
                <span className={cn("absolute bottom-0 right-0 mr-2 mb-2 font-mono text-sm tabular-nums", error || value.length > 500 ? "text-destructive" : "text-muted-foreground")}>
                    {value.length}/500
                </span>
            </div>
            {error && (
                <p className="flex items-center gap-1.5 text-sm text-destructive font-medium">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                </p>
            )}
            { variables.length > 0 && <ReplyMessageHelp onInsertVariable={handleInsertVariable} variables={variables} defaultOpen={defaultOpenHelp} />}
        </div>
    );
}
