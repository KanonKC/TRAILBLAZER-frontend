"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { ArrowLeft, Play, Save } from "lucide-react";

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

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-4">
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
                    <Button variant="outline" onClick={editor.test} disabled={editor.isTesting}>
                        <Play className="h-4 w-4 mr-1" />
                        {editor.isTesting ? "กำลังทดสอบ..." : "ทดสอบ"}
                    </Button>
                    <Button onClick={editor.save} disabled={editor.isSaving || !editor.isDirty}>
                        <Save className="h-4 w-4 mr-1" />
                        {editor.isSaving ? "กำลังบันทึก..." : "บันทึก"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-[220px_1fr_280px] gap-4">
                <div className="border rounded-lg p-3">
                    <CanvasLayerList
                        elements={editor.elements}
                        selectedElementId={editor.selectedElementId}
                        onSelect={editor.setSelectedElementId}
                        onMove={editor.moveLayer}
                        onAdd={editor.addElement}
                    />
                </div>

                <div className="space-y-4">
                    <CanvasStage
                        elements={editor.elements}
                        selectedElementId={editor.selectedElementId}
                        onSelect={editor.setSelectedElementId}
                        onChange={editor.updateElement}
                    />

                    <div className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold">Timeline</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>ความยาวรวม (ms)</span>
                                <Input
                                    type="number"
                                    className="w-24 h-7"
                                    value={editor.canvas.duration_ms}
                                    onChange={(e) => editor.updateMeta({ duration_ms: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                        <CanvasTimeline
                            elements={editor.elements}
                            canvasDurationMs={editor.canvas.duration_ms}
                            selectedElementId={editor.selectedElementId}
                            onSelect={editor.setSelectedElementId}
                            onChange={editor.updateElement}
                        />
                    </div>
                </div>

                <div className="border rounded-lg p-3">
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
