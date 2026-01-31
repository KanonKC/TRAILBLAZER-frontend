import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReplyMessageHelpProps {
    className?: string;
    variant?: "default" | "overlay";
}

export function ReplyMessageHelp({ className, variant = "default" }: ReplyMessageHelpProps) {
    const isOverlay = variant === "overlay";

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
                    <div className={cn("text-sm space-y-2", isOverlay ? "text-white/70" : "text-muted-foreground")}>
                        <p>คุณสามารถพิมพ์ตัวแปรเหล่านี้ลงในช่องข้อความ เพื่อให้ระบบแทนที่ด้วยข้อมูลจริงโดยอัตโนมัติ</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><code className={cn("px-1 rounded", isOverlay ? "bg-white/10 text-white/90" : "bg-muted text-foreground")}>{"{{user_name}}"}</code> - ชื่อที่แสดงผลของผู้ทักทาย (เช่น "User123")</li>
                            <li><code className={cn("px-1 rounded", isOverlay ? "bg-white/10 text-white/90" : "bg-muted text-foreground")}>{"{{user_login}}"}</code> - Twitch Username ของผู้ทักทาย (เช่น "user123")</li>
                            <li><code className={cn("px-1 rounded", isOverlay ? "bg-white/10 text-white/90" : "bg-muted text-foreground")}>{"{{broadcaster_user_name}}"}</code> - ชื่อที่แสดงผลของช่อง (เช่น "Streamer")</li>
                            <li><code className={cn("px-1 rounded", isOverlay ? "bg-white/10 text-white/90" : "bg-muted text-foreground")}>{"{{broadcaster_user_login}}"}</code> - Twitch Username ของช่อง (เช่น "streamer")</li>
                            <li><code className={cn("px-1 rounded", isOverlay ? "bg-white/10 text-white/90" : "bg-muted text-foreground")}>{"{{message_text}}"}</code> - ข้อความที่พิมพ์มา</li>
                            <li><code className={cn("px-1 rounded", isOverlay ? "bg-white/10 text-white/90" : "bg-muted text-foreground")}>{"{{color}}"}</code> - สีแชทของผู้ใช้งาน</li>
                        </ul>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
