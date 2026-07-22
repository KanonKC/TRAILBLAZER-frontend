"use client"

import { CanvasElement } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CanvasTimelineProps {
    elements: CanvasElement[];
    canvasDurationMs: number;
    selectedElementId: string | null;
    onSelect: (id: string) => void;
    onChange: (id: string, patch: Partial<CanvasElement>) => void;
}

export function CanvasTimeline({ elements, canvasDurationMs, selectedElementId, onSelect, onChange }: CanvasTimelineProps) {
    const sorted = elements.slice().sort((a, b) => a.z_index - b.z_index);

    return (
        <div className="space-y-2">
            {sorted.map((element) => {
                const startPct = Math.min(100, (element.start_delay_ms / canvasDurationMs) * 100);
                const widthPct = Math.min(100 - startPct, (element.duration_ms / canvasDurationMs) * 100);
                const isSelected = element.id === selectedElementId;

                return (
                    <div
                        key={element.id}
                        className={`flex items-center gap-3 p-2 rounded-md border cursor-pointer ${isSelected ? "border-primary bg-primary/5" : "border-muted"}`}
                        onClick={() => onSelect(element.id)}
                    >
                        <span className="text-xs w-20 truncate shrink-0">
                            {element.type === "text" ? (element.text_content || "Text") : element.media?.name ?? element.type}
                        </span>
                        <div className="relative flex-1 h-6 bg-muted rounded">
                            <div
                                className="absolute top-0 h-full bg-primary/70 rounded"
                                style={{ left: `${startPct}%`, width: `${Math.max(widthPct, 2)}%` }}
                            />
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            <Label className="text-xs text-muted-foreground">Start</Label>
                            <Input
                                type="number"
                                className="w-20 h-7 text-xs"
                                value={element.start_delay_ms}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => onChange(element.id, { start_delay_ms: Number(e.target.value) })}
                            />
                            <Label className="text-xs text-muted-foreground">Duration</Label>
                            <Input
                                type="number"
                                className="w-20 h-7 text-xs"
                                value={element.duration_ms}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => onChange(element.id, { duration_ms: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
