"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/components/user-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { SmartOverlayUrlInput } from "@/components/widget/SmartOverlayUrlInput";
import { OBSSetupHelp } from "@/components/widget/OBSSetupHelp";
import { Plus, Trash2 } from "lucide-react";
import { tbToast } from "@/utils/tbToast";
import { listCanvases, createCanvas, deleteCanvas, getCanvasOverlayKey } from "@/features/canvas/api/canvas.api";
import { Canvas } from "@/features/canvas/types";

export default function CanvasListPage() {
    const { user } = useUser();
    const [canvases, setCanvases] = useState<Canvas[]>([]);
    const [overlayKey, setOverlayKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const load = async () => {
        setIsLoading(true);
        try {
            const [canvasList, key] = await Promise.all([listCanvases(), getCanvasOverlayKey()]);
            setCanvases(canvasList);
            setOverlayKey(key);
        } catch (error) {
            console.error("Failed to load canvases", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleCreate = async () => {
        if (!newName.trim()) return;
        setIsCreating(true);
        try {
            await createCanvas({ name: newName.trim() });
            setNewName("");
            setIsDialogOpen(false);
            tbToast.success({ title: "สร้าง Canvas สำเร็จ" });
            await load();
        } catch (error: any) {
            console.error("Failed to create canvas", error);
            tbToast.error({ title: "สร้าง Canvas ไม่สำเร็จ", error: error.response?.data });
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteCanvas(id);
            tbToast.success({ title: "ลบ Canvas สำเร็จ" });
            setCanvases((prev) => prev.filter((c) => c.id !== id));
        } catch (error) {
            console.error("Failed to delete canvas", error);
            tbToast.error({ title: "ลบ Canvas ไม่สำเร็จ" });
        }
    };

    const overlayUrl = typeof window !== "undefined" && user
        ? `${window.location.origin}/overlays/canvas/${user.id}${overlayKey ? `?key=${overlayKey}` : ""}`
        : "";

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Canvas</h1>
                    <p className="text-sm text-muted-foreground">
                        สร้างฉาก visual/audio ที่ปรับแต่งได้ แล้วผูกกับวิดเจ็ตของคุณ
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="h-4 w-4 mr-1" />สร้าง Canvas</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>สร้าง Canvas ใหม่</DialogTitle>
                        </DialogHeader>
                        <Input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="ชื่อ Canvas เช่น Welcome Popup"
                            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                        />
                        <DialogFooter>
                            <Button onClick={handleCreate} disabled={isCreating || !newName.trim()}>
                                {isCreating ? "กำลังสร้าง..." : "สร้าง"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Canvas Overlay URL</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        เพิ่ม URL นี้เป็น Browser Source ใน OBS เพียงครั้งเดียว — Canvas ทุกอันที่คุณสร้างจะเล่นผ่านที่นี่
                    </p>
                    <SmartOverlayUrlInput
                        url={overlayUrl}
                        slug="canvas-overlay"
                        onSuccess={(data) => setOverlayKey(data.overlayKey)}
                    />
                    <OBSSetupHelp variant="default" />
                </CardContent>
            </Card>

            <div className="space-y-3">
                {isLoading ? (
                    <p className="text-sm text-muted-foreground">กำลังโหลด...</p>
                ) : canvases.length === 0 ? (
                    <p className="text-sm text-muted-foreground">ยังไม่มี Canvas — สร้างอันแรกของคุณเลย</p>
                ) : (
                    canvases.map((canvas) => (
                        <Card key={canvas.id}>
                            <CardHeader className="flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">{canvas.name}</CardTitle>
                                    <p className="text-xs text-muted-foreground">
                                        {canvas.elements.length} elements · ทำงานแล้ว {canvas.triggered_count} ครั้ง
                                        {!canvas.enabled && " · ปิดใช้งานอยู่"}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/dashboard/canvas/${canvas.id}`}>แก้ไข</Link>
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(canvas.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </CardHeader>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
