"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { useHotkeys } from "react-hotkeys-hook";
import { useCanvasEditor } from "../hooks/useCanvasEditor";
import { CanvasWithLinks, CanvasVariable } from "../types";
import { CanvasStage } from "./CanvasStage";
import { CanvasLayerList } from "./CanvasLayerList";
import { CanvasInspector } from "./CanvasInspector";
import { CanvasTimeline } from "./CanvasTimeline";
import { ConnectedWidgets } from "./ConnectedWidgets";
import { getCanvasVariables } from "../api/canvas.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play, Save, Undo2, Redo2 } from "lucide-react";

const NUDGE_PCT = 0.5;
const NUDGE_PCT_LARGE = 5;

interface CanvasEditorProps {
    initialCanvas: CanvasWithLinks;
}

export function CanvasEditor({ initialCanvas }: CanvasEditorProps) {
    const editor = useCanvasEditor(initialCanvas);
    const [variables, setVariables] = useState<CanvasVariable[]>([]);

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
        <div className="max-w-[1400px] mx-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
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

            <div className="grid grid-cols-[220px_1fr_300px] gap-4">
                <div className="border rounded-lg p-3 h-fit">
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

                <div className="space-y-4 min-w-0">
                    <CanvasStage
                        elements={editor.elements}
                        selectedElementId={editor.selectedElementId}
                        hiddenIds={editor.hiddenIds}
                        lockedIds={editor.lockedIds}
                        onSelect={editor.setSelectedElementId}
                        onChange={editor.updateElement}
                    />

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
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

                <div className="border rounded-lg p-3 h-fit">
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
