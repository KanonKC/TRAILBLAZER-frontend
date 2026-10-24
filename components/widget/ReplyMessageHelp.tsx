import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Info, MousePointerClick } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect } from "react";

export interface VariableItem {
    variable: string;
    description: string;
    example: string;
}

interface ReplyMessageHelpProps {
    className?: string;
    onInsertVariable?: (variable: string) => void;
    variables: VariableItem[];
    defaultOpen?: boolean;
}

export function ReplyMessageHelp({ className, onInsertVariable, variables, defaultOpen = false }: ReplyMessageHelpProps) {

    const handleVariableClick = (variable: string) => {
        if (onInsertVariable) {
            onInsertVariable(variable);
        }
    };

    useEffect(() => {
        console.log("DO", defaultOpen)
    }, [defaultOpen])

    return (
        <Accordion type="single" collapsible defaultValue={defaultOpen ? "variables" : undefined} className={cn("w-full border rounded-lg bg-secondary/40 border-border", className)}>
            <AccordionItem value="variables" className="border-none">
                <AccordionTrigger className="px-4 py-3 hover:no-underline rounded-t-lg transition-colors cursor-pointer text-foreground hover:bg-secondary data-[state=open]:bg-secondary">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span>ตัวแปรที่ใช้ได้ (Variables)</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-3">
                    <div className="text-sm space-y-4 text-muted-foreground">
                        {/* Instructions with click hint */}
                        <div className="flex items-start gap-2">
                            <MousePointerClick className="h-4 w-4 mt-0.5 shrink-0 text-info" />
                            <p className="leading-relaxed">
                                คลิกที่ตัวแปรด้านล่างเพื่อเพิ่มลงในข้อความ หรือพิมพ์เองได้โดยตรง
                            </p>
                        </div>

                        {/* Variable cards */}
                        <div className="space-y-2">
                            {variables.map((item) => (
                                <div
                                    key={item.variable}
                                    className="flex items-center justify-between gap-4 p-3 rounded-lg border transition-all bg-secondary/40 border-border"
                                >
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <span className="text-sm text-foreground">
                                            {item.description}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
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
                                            "bg-gradient-to-r from-info/20 to-primary/20 border-foreground/20 text-primary-foreground hover:from-info/30 hover:to-primary/30 hover:border-foreground/30",
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
