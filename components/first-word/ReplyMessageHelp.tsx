import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Info, MousePointerClick } from "lucide-react"
import { cn } from "@/lib/utils"

interface VariableItem {
    variable: string;
    description: string;
    example: string;
}

const AVAILABLE_VARIABLES: VariableItem[] = [
    {
        variable: "{{user_name}}",
        description: "ชื่อที่แสดงผลของผู้ทักทาย",
        example: "User123"
    }
];

interface ReplyMessageHelpProps {
    className?: string;
    variant?: "default" | "overlay";
    onInsertVariable?: (variable: string) => void;
}

export function ReplyMessageHelp({ className, variant = "default", onInsertVariable }: ReplyMessageHelpProps) {
    const isOverlay = variant === "overlay";

    const handleVariableClick = (variable: string) => {
        if (onInsertVariable) {
            onInsertVariable(variable);
        }
    };

    return (
        <Accordion type="single" collapsible className={cn("w-full border rounded-lg", isOverlay ? "bg-white/5 border-white/10" : "bg-card border-border", className)}>
            <AccordionItem value="variables" className="border-none">
                <AccordionTrigger className={cn(
                    "px-4 py-3 hover:no-underline rounded-t-lg transition-colors cursor-pointer",
                    isOverlay
                        ? "text-white/90 hover:bg-white/10 data-[state=open]:bg-white/10"
                        : "text-foreground hover:bg-muted/50 data-[state=open]:bg-muted/50"
                )}>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Info className={cn("h-4 w-4", isOverlay ? "text-white/70" : "text-muted-foreground")} />
                        <span>ตัวแปรที่ใช้ได้ (Variables)</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-3">
                    <div className={cn("text-sm space-y-4", isOverlay ? "text-white/70" : "text-muted-foreground")}>
                        {/* Instructions with click hint */}
                        <div className="flex items-start gap-2">
                            <MousePointerClick className={cn("h-4 w-4 mt-0.5 shrink-0", isOverlay ? "text-blue-400" : "text-primary")} />
                            <p className="leading-relaxed">
                                คลิกที่ตัวแปรด้านล่างเพื่อเพิ่มลงในข้อความ หรือพิมพ์เองได้โดยตรง
                            </p>
                        </div>

                        {/* Variable cards */}
                        <div className="space-y-2">
                            {AVAILABLE_VARIABLES.map((item) => (
                                <div
                                    key={item.variable}
                                    className={cn(
                                        "flex items-center justify-between gap-4 p-3 rounded-lg border transition-all",
                                        isOverlay
                                            ? "bg-white/5 border-white/10"
                                            : "bg-muted/30 border-border"
                                    )}
                                >
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <span className={cn("text-sm", isOverlay ? "text-white/50" : "text-white/70")}>
                                            {item.description}
                                        </span>
                                        <span className={cn("text-xs", isOverlay ? "text-white/40" : "text-white/50")}>
                                            ตัวอย่าง: <span className="italic">&quot;{item.example}&quot;</span>
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleVariableClick(item.variable)}
                                        className={cn(
                                            "shrink-0 px-3 py-1.5 rounded-md font-mono text-sm font-medium transition-all",
                                            "border shadow-sm",
                                            "hover:scale-105 active:scale-95",
                                            isOverlay
                                                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-white/20 text-white hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/30"
                                                : "bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 text-primary hover:from-primary/20 hover:to-primary/10 hover:border-primary/30",
                                            "cursor-pointer"
                                        )}
                                        title="คลิกเพื่อเพิ่มลงในข้อความ"
                                    >
                                        {item.variable}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
