import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface OBSSetupHelpProps {
    className?: string;
    variant?: "default" | "overlay";
}

export function OBSSetupHelp({ className, variant = "overlay" }: OBSSetupHelpProps) {
    const isOverlay = variant === "overlay";

    return (
        <Accordion type="single" collapsible className={cn("w-full border rounded-lg mt-3", isOverlay ? "bg-white/5 border-white/10" : "bg-card border-border", className)}>
            <AccordionItem value="obs-setup" className="border-none">
                <AccordionTrigger className={cn(
                    "px-4 py-3 hover:no-underline rounded-t-lg transition-colors cursor-pointer",
                    isOverlay
                        ? "text-white/90 hover:bg-white/10 data-[state=open]:bg-white/10"
                        : "text-foreground hover:bg-muted/50 data-[state=open]:bg-muted/50"
                )}>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <HelpCircle className={cn("h-4 w-4", isOverlay ? "text-white/70" : "text-muted-foreground")} />
                        <span>วิธีตั้งค่าใน OBS</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-3">
                    <ul className={cn("text-sm list-disc pl-5 space-y-1", isOverlay ? "text-white/70" : "text-muted-foreground")}>
                        <li>ไปที่โปรแกรม OBS จากนั้นไปที่ Sources {">"} Add Source {">"} Browser</li>
                        <li>นำลิงก์ไปใส่ไว้ที่ช่อง URL</li>
                        <li>กดติ๊กถูกที่ตัวเลือก Control audio via OBS จากนั้นกด OK</li>
                        <li>ตามหาแทร็กเสียงของ Browser ที่เราตั้งค่าไปก่อนหน้า จากนั้นเลือก Audio Monitoring เป็นแบบ Monitor and Output</li>
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
