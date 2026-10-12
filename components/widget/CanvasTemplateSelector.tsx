"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCanvases, setWidgetCanvas } from "@/features/canvas/api/canvas.api";
import { Canvas } from "@/features/canvas/types";
import { tbToast } from "@/utils/tbToast";

const NONE = "none";

interface CanvasTemplateSelectorProps {
    widgetId: string;
    disabled?: boolean;
}

/**
 * Picks the one canvas a widget plays on its overlay. Saves immediately —
 * the link lives outside the widget's own config.
 */
export function CanvasTemplateSelector({ widgetId, disabled }: CanvasTemplateSelectorProps) {
    const [canvases, setCanvases] = useState<Canvas[] | null>(null);
    const [value, setValue] = useState<string>(NONE);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        getCanvases()
            .then((list) => {
                setCanvases(list);
                setValue(list.find((c) => c.widget_ids.includes(widgetId))?.id ?? NONE);
            })
            .catch((error) => {
                console.error("Failed to load canvases", error);
                setCanvases([]);
            });
    }, [widgetId]);

    const handleChange = async (next: string) => {
        const previous = value;
        setValue(next);
        setIsSaving(true);
        try {
            await setWidgetCanvas(widgetId, next === NONE ? null : next);
            tbToast.success({ title: next === NONE ? "ยกเลิกการใช้ Canvas แล้ว" : "เลือก Canvas สำเร็จ" });
        } catch (error) {
            console.error("Failed to set widget canvas", error);
            setValue(previous);
            tbToast.error({ title: "ไม่สามารถเลือก Canvas ได้" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Select value={value} onValueChange={handleChange} disabled={disabled || isSaving || canvases === null}>
                    <SelectTrigger className="w-full sm:w-80">
                        <SelectValue placeholder="เลือก Canvas..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={NONE}>ไม่แสดง Canvas</SelectItem>
                        {canvases?.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                                {c.name} · {c.template_type === "video" ? "วิดีโอ" : "รูป + เสียง"}{!c.enabled ? " (ปิดอยู่)" : ""}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {(isSaving || canvases === null) && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
            <Link href="/my/canvas" target="_blank" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground">
                จัดการ Canvas <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
        </div>
    );
}
