"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { useHotkeys } from "react-hotkeys-hook";
import { useCanvasEditor } from "../hooks/useCanvasEditor";
import { CanvasWithLinks, CanvasVariable, CanvasPlayEvent } from "../types";
import { CanvasStage } from "./CanvasStage";
import { CanvasLayerList } from "./CanvasLayerList";
import { CanvasInspector } from "./CanvasInspector";
import { CanvasTimeline } from "./CanvasTimeline";
import { ConnectedWidgets } from "./ConnectedWidgets";
import { CanvasPlayer } from "@/components/canvas/CanvasPlayer";
import { getCanvasVariables } from "../api/canvas.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Pause, Play, Save, Square, Undo2, Redo2, X } from "lucide-react";

const NUDGE_PCT = 0.5;
const NUDGE_PCT_LARGE = 5;

interface CanvasEditorProps {
    initialCanvas: CanvasWithLinks;
}

export function CanvasEditor({ initialCanvas }: CanvasEditorProps) {
    const editor = useCanvasEditor(initialCanvas);
    const [variables, setVariables] = useState<CanvasVariable[]>([]);
    const [previewEvent, setPreviewEvent] = useState<CanvasPlayEvent | null>(null);
    const [isPreviewPaused, setIsPreviewPaused] = useState(false);

    // Builds the play event straight from whatever's currently in the editor —
    // no save and no round-trip to the backend, so you can try an in-progress
    // edit immediately instead of only ever previewing the last saved version.
    const handlePreview = () => {
        setIsPreviewPaused(false);
        editor.setCurrentTimeMs(0);
        setPreviewEvent({
            userId: "preview",
            playId: `preview-${Date.now()}`,
            canvasId: editor.canvas.id,
            durationMs: editor.canvas.duration_ms,
            elements: editor.elements.map((el) => ({
                id: el.id,
                type: el.type,
                media_url: el.media?.url ?? null,
                text_content: el.text_content,
                text_style: el.text_style,
                x: el.x,
                y: el.y,
                width: el.width,
                height: el.height,
                rotation: el.rotation,
                z_index: el.z_index,
                opacity: el.opacity,
                start_delay_ms: el.start_delay_ms,
                duration_ms: el.duration_ms,
                enter_transition: el.enter_transition,
                exit_transition: el.exit_transition,
                transition_ms: el.transition_ms,
                volume: el.volume,
                loop: el.loop,
            })),
        });
    };

    // Drives the timeline playhead in lockstep with the preview. Each tick adds
    // the frame's delta on top of whatever currentTimeMs currently is (via a
    // functional update) rather than recomputing from a fixed start reference —
    // that's what lets a ruler click land correctly: the click already moved
    // currentTimeMs, and the very next tick just continues forward from there
    // instead of snapping back to "elapsed since play was pressed". Pausing
    // simply stops this effect from running (dependency below), so nothing
    // advances until it's resumed.
    useEffect(() => {
        if (!previewEvent || isPreviewPaused) return;
        let raf: number;
        let lastFrame = performance.now();

        const tick = (t: number) => {
            const delta = t - lastFrame;
            lastFrame = t;
            editor.setCurrentTimeMs((prev) => Math.min(prev + delta, previewEvent.durationMs));
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [previewEvent, isPreviewPaused]);

    // Reaching the end is detected here (reacting to state) rather than inside
    // the tick above, so it isn't tangled up with the functional setState call.
    useEffect(() => {
        if (previewEvent && editor.currentTimeMs >= previewEvent.durationMs) {
            closePreview();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor.currentTimeMs, previewEvent]);

    const closePreview = () => {
        setPreviewEvent(null);
        setIsPreviewPaused(false);
        editor.setCurrentTimeMs(0);
    };

    useEffect(() => {
        const widgetTypeSlugs = editor.canvas.links
            .map((link) => link.widget.widget_type_slug)
            .filter((slug): slug is string => !!slug);
        getCanvasVariables(widgetTypeSlugs)
            .then(setVariables)
            .catch((error) => console.error("Failed to load canvas variables", error));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor.linkedWidgetIds.join(",")]);

    // Shortcuts stay off while typing — enableOnFormTags defaults to false, so
    // Delete inside the name/text inputs behaves normally.
    const selectedId = editor.selectedElementId;

    useHotkeys("delete, backspace", () => { if (selectedId) editor.removeElement(selectedId); }, [selectedId, editor.removeElement]);
    useHotkeys("mod+d", (e) => { e.preventDefault(); if (selectedId) editor.duplicateElement(selectedId); }, [selectedId, editor.duplicateElement]);
    useHotkeys("mod+z", (e) => { e.preventDefault(); editor.undo(); }, [editor.undo]);
    useHotkeys("mod+shift+z, mod+y", (e) => { e.preventDefault(); editor.redo(); }, [editor.redo]);
    useHotkeys("mod+s", (e) => { e.preventDefault(); if (editor.isDirty) editor.save(); }, [editor.isDirty, editor.save]);
    useHotkeys("escape", () => editor.setSelectedElementId(null), [editor.setSelectedElementId]);

    useHotkeys("up", (e) => { e.preventDefault(); if (selectedId) editor.nudgeElement(selectedId, 0, -NUDGE_PCT); }, [selectedId, editor.nudgeElement]);
    useHotkeys("down", (e) => { e.preventDefault(); if (selectedId) editor.nudgeElement(selectedId, 0, NUDGE_PCT); }, [selectedId, editor.nudgeElement]);
    useHotkeys("left", (e) => { e.preventDefault(); if (selectedId) editor.nudgeElement(selectedId, -NUDGE_PCT, 0); }, [selectedId, editor.nudgeElement]);
    useHotkeys("right", (e) => { e.preventDefault(); if (selectedId) editor.nudgeElement(selectedId, NUDGE_PCT, 0); }, [selectedId, editor.nudgeElement]);

    useHotkeys("shift+up", (e) => { e.preventDefault(); if (selectedId) editor.nudgeElement(selectedId, 0, -NUDGE_PCT_LARGE); }, [selectedId, editor.nudgeElement]);
    useHotkeys("shift+down", (e) => { e.preventDefault(); if (selectedId) editor.nudgeElement(selectedId, 0, NUDGE_PCT_LARGE); }, [selectedId, editor.nudgeElement]);
    useHotkeys("shift+left", (e) => { e.preventDefault(); if (selectedId) editor.nudgeElement(selectedId, -NUDGE_PCT_LARGE, 0); }, [selectedId, editor.nudgeElement]);
    useHotkeys("shift+right", (e) => { e.preventDefault(); if (selectedId) editor.nudgeElement(selectedId, NUDGE_PCT_LARGE, 0); }, [selectedId, editor.nudgeElement]);

    return (
        // 65px ≈ the navbar's h-16 + its border. Filling exactly the remaining
        // viewport (instead of growing with content) is what keeps the timeline
        // visible without a page-level scroll — the grid below scrolls internally
        // per-column instead.
        <div className="h-[calc(100vh-65px)] flex flex-col px-4 py-4 gap-4 overflow-hidden">
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/canvas"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Input
                        value={editor.canvas.name}
                        onChange={(e) => editor.updateMeta({ name: e.target.value })}
                        className="text-lg font-semibold h-10 w-64"
                    />
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={editor.canvas.enabled}
                            onCheckedChange={(checked) => editor.updateMeta({ enabled: checked })}
                        />
                        <span className="text-sm text-muted-foreground">
                            {editor.canvas.enabled ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={editor.undo} disabled={!editor.canUndo} title="ย้อนกลับ (Ctrl+Z)">
                        <Undo2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={editor.redo} disabled={!editor.canRedo} title="ทำซ้ำ (Ctrl+Shift+Z)">
                        <Redo2 className="h-4 w-4" />
                    </Button>
                    {previewEvent ? (
                        <>
                            <Button variant="outline" size="icon" onClick={() => setIsPreviewPaused((p) => !p)} title={isPreviewPaused ? "เล่นต่อ" : "หยุดชั่วคราว"}>
                                {isPreviewPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                            </Button>
                            <Button variant="outline" size="icon" onClick={closePreview} title="หยุด">
                                <Square className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" onClick={handlePreview} title="เล่นตัวอย่างในหน้านี้เลย ไม่ต้องบันทึกก่อน">
                            <Play className="h-4 w-4 mr-1" />
                            เล่น
                        </Button>
                    )}
                    <Button variant="outline" onClick={editor.test} disabled={editor.isTesting}>
                        <Play className="h-4 w-4 mr-1" />
                        {editor.isTesting ? "กำลังทดสอบ..." : "ทดสอบ"}
                    </Button>
                    <Button onClick={editor.save} disabled={editor.isSaving || !editor.isDirty} title="บันทึก (Ctrl+S)">
                        <Save className="h-4 w-4 mr-1" />
                        {editor.isSaving ? "กำลังบันทึก..." : "บันทึก"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-[260px_1fr_340px] gap-4 flex-1 min-h-0">
                <div className="border rounded-lg p-3 overflow-y-auto min-h-0">
                    <CanvasLayerList
                        elements={editor.elements}
                        selectedElementId={editor.selectedElementId}
                        hiddenIds={editor.hiddenIds}
                        lockedIds={editor.lockedIds}
                        onSelect={editor.setSelectedElementId}
                        onReorder={editor.reorderLayers}
                        onAdd={editor.addElement}
                        onToggleHidden={editor.toggleHidden}
                        onToggleLocked={editor.toggleLocked}
                    />
                </div>

                <div className="flex flex-col gap-3 min-w-0 min-h-0">
                    {/* Capped narrower than the column so the stage doesn't dominate
                        the page — the timeline below needs guaranteed room too. */}
                    <div className="w-full max-w-[640px] mx-auto shrink-0 relative">
                        <CanvasStage
                            elements={editor.elements}
                            selectedElementId={editor.selectedElementId}
                            hiddenIds={editor.hiddenIds}
                            lockedIds={editor.lockedIds}
                            currentTimeMs={editor.currentTimeMs}
                            isPreviewPlaying={!!previewEvent}
                            onSelect={editor.setSelectedElementId}
                            onChange={editor.updateElement}
                        />
                        {previewEvent && (
                            <div className="absolute inset-0 rounded-lg overflow-hidden bg-black">
                                <CanvasPlayer
                                    event={previewEvent}
                                    onComplete={closePreview}
                                    currentTimeMs={editor.currentTimeMs}
                                    isPaused={isPreviewPaused}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-white hover:bg-white/20 hover:text-white"
                                    onClick={closePreview}
                                    title="ปิดตัวอย่าง"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 flex-1 min-h-0">
                        <div className="flex items-center justify-between shrink-0">
                            <h4 className="text-sm font-semibold">Timeline</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>ความยาวรวม (ms)</span>
                                <Input
                                    type="number"
                                    className="w-24 h-7"
                                    value={editor.canvas.duration_ms}
                                    onChange={(e) => editor.updateMeta({ duration_ms: Math.max(100, Number(e.target.value)) })}
                                />
                            </div>
                        </div>
                        <div className="flex-1 min-h-0 overflow-y-auto">
                            <CanvasTimeline
                                elements={editor.elements}
                                canvasDurationMs={editor.canvas.duration_ms}
                                selectedElementId={editor.selectedElementId}
                                currentTimeMs={editor.currentTimeMs}
                                onSelect={editor.setSelectedElementId}
                                onChange={editor.updateElement}
                                onTimeChange={editor.setCurrentTimeMs}
                            />
                        </div>
                    </div>
                </div>

                <div className="border rounded-lg p-3 overflow-y-auto min-h-0">
                    <Tabs defaultValue="inspector">
                        <TabsList className="w-full">
                            <TabsTrigger value="inspector" className="flex-1">Element</TabsTrigger>
                            <TabsTrigger value="widgets" className="flex-1">Widgets</TabsTrigger>
                        </TabsList>
                        <TabsContent value="inspector">
                            <CanvasInspector
                                element={editor.selectedElement}
                                variables={variables}
                                onChange={editor.updateElement}
                                onRemove={editor.removeElement}
                            />
                        </TabsContent>
                        <TabsContent value="widgets">
                            <ConnectedWidgets
                                linkedWidgetIds={editor.linkedWidgetIds}
                                onToggle={editor.toggleWidgetLink}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
