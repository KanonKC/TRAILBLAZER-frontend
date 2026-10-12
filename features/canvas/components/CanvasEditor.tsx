"use client"

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Film, ImageIcon, Loader2, Music, Play, Square, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { CanvasPlayer } from "@/components/overlay/CanvasPlayer";
import { cn } from "@/lib/utils";
import { tbToast } from "@/utils/tbToast";
import { createCanvas, deleteCanvas, getCanvas, updateCanvas } from "../api/canvas.api";
import { CanvasMediaSlot, CanvasPlayback, CanvasTemplateType } from "../types";
import { MediaPickerDialog } from "./MediaPickerDialog";

interface SelectedMedia {
    key: string;
    name: string;
    url: string;
}

const DEFAULT_DURATION_MS = 5000;

export function CanvasEditor({ canvasId }: { canvasId: string | null }) {
    const router = useRouter();
    const isNew = !canvasId;
    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);
    const [name, setName] = useState("");
    const [templateType, setTemplateType] = useState<CanvasTemplateType>("image_audio");
    const [enabled, setEnabled] = useState(true);
    const [volume, setVolume] = useState(100);
    const [durationMs, setDurationMs] = useState(DEFAULT_DURATION_MS);
    const [media, setMedia] = useState<Record<CanvasMediaSlot, SelectedMedia | null>>({ image: null, audio: null, video: null });
    const [pickerSlot, setPickerSlot] = useState<CanvasMediaSlot | null>(null);
    const [previewId, setPreviewId] = useState<string | null>(null);

    useEffect(() => {
        if (!canvasId) return;
        getCanvas(canvasId)
            .then((c) => {
                setName(c.name);
                setTemplateType(c.template_type);
                setEnabled(c.enabled);
                setVolume(c.volume);
                setDurationMs(c.duration_ms);
                setMedia({ image: c.image, audio: c.audio, video: c.video });
            })
            .catch((error) => {
                console.error("Failed to load canvas", error);
                tbToast.error({ title: "ไม่พบ Canvas นี้" });
                router.push("/my/canvas");
            })
            .finally(() => setIsLoading(false));
    }, [canvasId, router]);

    const needsManualDuration = templateType === "image_audio" && !media.audio;
    const hasMedia = templateType === "video" ? !!media.video : !!(media.image || media.audio);
    const canSave = name.trim().length > 0 && hasMedia;

    const previewPlayback = useMemo<CanvasPlayback | null>(() => {
        if (!previewId) return null;
        return {
            canvas_id: canvasId ?? "preview",
            template_type: templateType,
            image_url: templateType === "image_audio" ? media.image?.url ?? null : null,
            audio_url: templateType === "image_audio" ? media.audio?.url ?? null : null,
            video_url: templateType === "video" ? media.video?.url ?? null : null,
            volume,
            duration_ms: durationMs,
        };
    }, [previewId, canvasId, templateType, media, volume, durationMs]);

    const handleSave = async () => {
        if (!canSave) return;
        setIsSaving(true);
        const request = {
            name: name.trim(),
            template_type: templateType,
            enabled,
            volume,
            duration_ms: needsManualDuration ? durationMs : undefined,
            image_key: templateType === "image_audio" ? media.image?.key ?? null : null,
            audio_key: templateType === "image_audio" ? media.audio?.key ?? null : null,
            video_key: templateType === "video" ? media.video?.key ?? null : null,
        };
        try {
            if (canvasId) {
                const saved = await updateCanvas(canvasId, request);
                setDurationMs(saved.duration_ms);
                tbToast.success({ title: "บันทึก Canvas สำเร็จ" });
            } else {
                const saved = await createCanvas(request);
                tbToast.success({ title: "สร้าง Canvas สำเร็จ" });
                router.replace(`/my/canvas/${saved.id}`);
            }
        } catch (error) {
            console.error("Failed to save canvas", error);
            tbToast.error({ title: "บันทึก Canvas ไม่สำเร็จ", error: (error as { response?: { data?: unknown } }).response?.data });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!canvasId || !confirm("ลบ Canvas นี้? Widget ที่ใช้อยู่จะไม่แสดง Canvas อีก")) return;
        setIsSaving(true);
        try {
            await deleteCanvas(canvasId);
            tbToast.success({ title: "ลบ Canvas สำเร็จ" });
            router.push("/my/canvas");
        } catch (error) {
            console.error("Failed to delete canvas", error);
            tbToast.error({ title: "ลบ Canvas ไม่สำเร็จ" });
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <Skeleton className="h-[480px] w-full rounded-xl" />;
    }

    const slots: CanvasMediaSlot[] = templateType === "video" ? ["video"] : ["image", "audio"];

    return (
        <div className="space-y-4">
            <Link href="/my/canvas" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-1 h-4 w-4" /> Canvas ทั้งหมด
            </Link>

            <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>{isNew ? "สร้าง Canvas ใหม่" : "แก้ไข Canvas"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="canvas-name">ชื่อ Template</Label>
                            <Input id="canvas-name" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} placeholder="เช่น Perk Hype" />
                        </div>

                        <div className="space-y-2">
                            <Label>ประเภท Template</Label>
                            <RadioGroup
                                value={templateType}
                                onValueChange={(v) => {
                                    setTemplateType(v as CanvasTemplateType);
                                    setPreviewId(null);
                                }}
                                className="grid grid-cols-2 gap-3"
                            >
                                {([
                                    { value: "image_audio", label: "รูป + เสียง", icon: <ImageIcon className="h-4 w-4" /> },
                                    { value: "video", label: "วิดีโอ", icon: <Film className="h-4 w-4" /> },
                                ] as const).map((opt) => (
                                    <Label
                                        key={opt.value}
                                        htmlFor={`type-${opt.value}`}
                                        className={cn(
                                            "flex cursor-pointer items-center gap-2 rounded-lg border p-3",
                                            templateType === opt.value ? "border-primary bg-primary/10" : "border-white/10"
                                        )}
                                    >
                                        <RadioGroupItem value={opt.value} id={`type-${opt.value}`} />
                                        {opt.icon} {opt.label}
                                    </Label>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="space-y-3">
                            {slots.map((slot) => (
                                <MediaSlotRow
                                    key={slot}
                                    slot={slot}
                                    value={media[slot]}
                                    onPick={() => setPickerSlot(slot)}
                                    onClear={() => setMedia((m) => ({ ...m, [slot]: null }))}
                                />
                            ))}
                            {templateType === "image_audio" && (
                                <p className="text-xs text-muted-foreground">ใส่รูป เสียง หรือทั้งคู่ก็ได้ Canvas จะแสดงจนเสียงเล่นจบ</p>
                            )}
                        </div>

                        {(templateType === "video" || media.audio) && (
                            <div className="space-y-2">
                                <Label>ระดับเสียง: {volume}%</Label>
                                <Slider value={[volume]} min={0} max={100} step={1} onValueChange={([v]) => setVolume(v)} />
                            </div>
                        )}

                        {needsManualDuration && (
                            <div className="space-y-2">
                                <Label htmlFor="canvas-duration">ระยะเวลาแสดงรูป (วินาที)</Label>
                                <Input
                                    id="canvas-duration"
                                    type="number"
                                    min={1}
                                    max={120}
                                    value={Math.round(durationMs / 1000)}
                                    onChange={(e) => setDurationMs(Math.min(120, Math.max(1, Number(e.target.value) || 1)) * 1000)}
                                    className="w-32"
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-between rounded-lg border border-white/10 p-3">
                            <div>
                                <Label htmlFor="canvas-enabled">เปิดใช้งาน</Label>
                                <p className="text-xs text-muted-foreground">ถ้าปิด Widget ที่ผูกไว้จะไม่แสดง Canvas นี้</p>
                            </div>
                            <Switch id="canvas-enabled" checked={enabled} onCheckedChange={setEnabled} />
                        </div>

                        <div className="flex flex-wrap justify-between gap-2">
                            {!isNew ? (
                                <Button variant="ghost" className="text-red-500 hover:text-red-500" onClick={handleDelete} disabled={isSaving}>
                                    <Trash2 className="mr-2 h-4 w-4" /> ลบ
                                </Button>
                            ) : <span />}
                            <Button onClick={handleSave} disabled={!canSave || isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                บันทึก
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>ตัวอย่าง</CardTitle>
                        {previewId ? (
                            <Button variant="outline" size="sm" onClick={() => setPreviewId(null)}>
                                <Square className="mr-2 h-4 w-4" /> หยุด
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" disabled={!hasMedia} onClick={() => setPreviewId(String(Date.now()))}>
                                <Play className="mr-2 h-4 w-4" /> เล่นตัวอย่าง
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div
                            className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/10"
                            style={{ backgroundImage: "repeating-conic-gradient(#1f1f23 0% 25%, #2a2a30 0% 50%)", backgroundSize: "24px 24px" }}
                        >
                            <CanvasPlayer playback={previewPlayback} playId={previewId} onFinished={() => setPreviewId(null)} />
                            {!previewId && (
                                <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                                    กด &quot;เล่นตัวอย่าง&quot; เพื่อดูว่าจะแสดงบน Overlay อย่างไร
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {pickerSlot && (
                <MediaPickerDialog
                    slot={pickerSlot}
                    isOpen={!!pickerSlot}
                    onOpenChange={(open) => !open && setPickerSlot(null)}
                    onSelect={(file) => {
                        setMedia((m) => ({ ...m, [pickerSlot]: { key: file.key, name: file.name, url: file.url } }));
                        setPreviewId(null);
                    }}
                />
            )}
        </div>
    );
}

const SLOT_LABEL: Record<CanvasMediaSlot, { label: string; icon: React.ReactNode }> = {
    image: { label: "รูปภาพ", icon: <ImageIcon className="h-4 w-4 text-sky-400" /> },
    audio: { label: "เสียง", icon: <Music className="h-4 w-4 text-emerald-400" /> },
    video: { label: "วิดีโอ", icon: <Film className="h-4 w-4 text-purple-400" /> },
};

function MediaSlotRow({ slot, value, onPick, onClear }: { slot: CanvasMediaSlot; value: SelectedMedia | null; onPick: () => void; onClear: () => void }) {
    const meta = SLOT_LABEL[slot];
    return (
        <div className="flex items-center gap-3 rounded-lg border border-white/10 p-3">
            {meta.icon}
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{meta.label}</p>
                <p className="truncate text-xs text-muted-foreground">{value ? value.name : "ยังไม่ได้เลือก"}</p>
            </div>
            {value && (
                <Button variant="ghost" size="icon" onClick={onClear} aria-label={`ลบ${meta.label}`}>
                    <X className="h-4 w-4" />
                </Button>
            )}
            <Button variant="outline" size="sm" onClick={onPick}>
                {value ? "เปลี่ยน" : "เลือก"}
            </Button>
        </div>
    );
}
