"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";

interface OBSSetupHelpProps {
    className?: string;
    type?: "audio" | "image" | "text"
    defaultOpen?: boolean;
}

export function OBSSetupHelp({ className, type = "audio", defaultOpen = false }: OBSSetupHelpProps) {
    return (
        <Accordion type="single" collapsible defaultValue={!!defaultOpen ? "obs-setup" : undefined} className={cn("w-full border rounded-lg mt-3 bg-secondary/40 border-border", className)}>
            <AccordionItem value="obs-setup" className="border-none">
                <AccordionTrigger className={cn(
                    "px-4 py-3 hover:no-underline rounded-t-lg transition-colors cursor-pointer text-foreground hover:bg-secondary data-[state=open]:bg-secondary"
                )}>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <HelpCircle className={"h-4 w-4 text-muted-foreground"} />
                        <span>วิธีตั้งค่าใน OBS</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-3">
                    <ol className={"text-sm list-decimal pl-5 space-y-1 text-muted-foreground"}>
                        <li>ไปที่โปรแกรม OBS จากนั้นไปที่ Sources {">"} Add Source {">"} Browser</li>
                        <li>นำลิงก์ไปใส่ไว้ที่ช่อง URL</li>
                        {
                            type === "audio" && (
                                <>
                                    <li>กดติ๊กถูกที่ตัวเลือก Control audio via OBS {">"} กด OK</li>
                                    <li>ไปที่แถบ Audio Mixer (แถบที่มีหลอดเสียง) จากนั้นสังเกตด้านล่างจะมีรูปเฟือง ให้กดที่รูปเฟืองนั้น</li>
                                    <li>เลื่อนหาแทร็กเสียงของ Browser ที่เราตั้งค่าไปก่อนหน้า {">"} หัวข้อ Audio Monitoring เลือกเป็นแบบ Monitor and Output (ตัวเลือกที่ 3)</li>
                                </>
                            )
                        }
                    </ol>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
