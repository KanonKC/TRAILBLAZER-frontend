"use client"

import { CanvasElement, CanvasTransition, CanvasVariable } from "../types";
import { MediaPicker } from "@/components/canvas/MediaPicker";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const TRANSITIONS: { value: CanvasTransition; label: string }[] = [
    { value: "fade", label: "Fade" },
    { value: "slide-up", label: "Slide Up" },
    { value: "slide-down", label: "Slide Down" },
    { value: "slide-left", label: "Slide Left" },
    { value: "slide-right", label: "Slide Right" },
    { value: "zoom", label: "Zoom" },
    { value: "pop", label: "Pop" },
    { value: "none", label: "None" },
];

interface CanvasInspectorProps {
    element: CanvasElement | null;
    variables: CanvasVariable[];
    onChange: (id: string, patch: Partial<CanvasElement>) => void;
    onRemove: (id: string) => void;
}

export function CanvasInspector({ element, variables, onChange, onRemove }: CanvasInspectorProps) {
    if (!element) {
        return <p className="text-sm text-muted-foreground p-4">เลือก element เพื่อแก้ไข</p>;
    }

    return (
        <div className="space-y-4 p-1">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold capitalize">{element.type}</h4>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRemove(element.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </div>

            {element.type === "text" ? (
                <div className="space-y-2">
                    <Label className="text-xs">ข้อความ</Label>
                    <Input
                        value={element.text_content ?? ""}
                        onChange={(e) => onChange(element.id, { text_content: e.target.value })}
                        placeholder="เช่น ยินดีต้อนรับ {{username}}!"
                    />
                    {variables.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {variables.map((v) => (
                                <button
                                    key={v.key}
                                    type="button"
                                    className="text-xs px-1.5 py-0.5 rounded bg-muted hover:bg-muted/70"
                                    onClick={() => onChange(element.id, { text_content: `${element.text_content ?? ""}{{${v.key}}}` })}
                                >
                                    {`{{${v.key}}}`}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-2">
                    <Label className="text-xs">ไฟล์สื่อ</Label>
                    <MediaPicker
                        type={element.type}
                        selectedKey={element.media_key}
                        selectedName={element.media?.name}
                        selectedUrl={element.media?.url}
                        onSelect={(file) => onChange(element.id, {
                            media_key: file.key,
                            media: { id: file.id, key: file.key, name: file.name, type: file.type, url: file.url },
                        })}
                    />
                </div>
            )}

            {(element.type === "audio" || element.type === "video") && (
                <div className="space-y-2">
                    <Label className="text-xs">ระดับเสียง ({element.volume}%)</Label>
                    <Slider
                        value={[element.volume]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={([v]) => onChange(element.id, { volume: v })}
                    />
                </div>
            )}

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <Label className="text-xs">Enter</Label>
                    <Select value={element.enter_transition} onValueChange={(v) => onChange(element.id, { enter_transition: v as CanvasTransition })}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {TRANSITIONS.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="text-xs">Exit</Label>
                    <Select value={element.exit_transition} onValueChange={(v) => onChange(element.id, { exit_transition: v as CanvasTransition })}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {TRANSITIONS.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-xs">Opacity ({Math.round(element.opacity * 100)}%)</Label>
                <Slider
                    value={[element.opacity * 100]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={([v]) => onChange(element.id, { opacity: v / 100 })}
                />
            </div>

            <div className="space-y-2">
                <Label className="text-xs">Rotation ({element.rotation}°)</Label>
                <Slider
                    value={[element.rotation]}
                    min={-180}
                    max={180}
                    step={1}
                    onValueChange={([v]) => onChange(element.id, { rotation: v })}
                />
            </div>
        </div>
    );
}
