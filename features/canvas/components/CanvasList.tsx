"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Film, ImageIcon, Music, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { tbToast } from "@/utils/tbToast";
import { getCanvases } from "../api/canvas.api";
import { Canvas } from "../types";

export function CanvasList() {
    const [canvases, setCanvases] = useState<Canvas[] | null>(null);

    useEffect(() => {
        getCanvases()
            .then(setCanvases)
            .catch((error) => {
                console.error("Failed to load canvases", error);
                tbToast.error({ title: "โหลด Canvas ไม่สำเร็จ" });
                setCanvases([]);
            });
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Canvas</h1>
                    <p className="text-sm text-muted-foreground">
                        สร้าง Template สื่อ (รูป + เสียง หรือวิดีโอ) แล้วนำไปแสดงบน Overlay ของ Widget
                    </p>
                </div>
                <Button asChild>
                    <Link href="/my/canvas/new"><Plus className="mr-2 h-4 w-4" /> สร้าง Canvas</Link>
                </Button>
            </div>

            {canvases === null ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[0, 1, 2].map((i) => <Skeleton key={i} className="h-56 rounded-xl" />)}
                </div>
            ) : canvases.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
                        <p className="text-muted-foreground">ยังไม่มี Canvas</p>
                        <Button asChild variant="outline">
                            <Link href="/my/canvas/new"><Plus className="mr-2 h-4 w-4" /> สร้าง Canvas แรก</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {canvases.map((c) => (
                        <Link key={c.id} href={`/my/canvas/${c.id}`} className="group">
                            <Card className="overflow-hidden transition-colors group-hover:border-primary">
                                <div className="flex aspect-video items-center justify-center bg-black/40">
                                    {c.template_type === "video" && c.video ? (
                                        <video src={c.video.url} muted preload="metadata" className="h-full w-full object-contain" />
                                    ) : c.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={c.image.url} alt={c.name} className="h-full w-full object-contain" />
                                    ) : (
                                        <Music className="h-10 w-10 text-emerald-400" />
                                    )}
                                </div>
                                <CardContent className="space-y-2 p-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="truncate font-medium">{c.name}</p>
                                        {!c.enabled && <Badge variant="outline">ปิดอยู่</Badge>}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                        {c.template_type === "video" ? (
                                            <span className="inline-flex items-center gap-1"><Film className="h-3 w-3" /> วิดีโอ</span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1"><ImageIcon className="h-3 w-3" /> รูป + เสียง</span>
                                        )}
                                        <span>· {(c.duration_ms / 1000).toFixed(1)} วินาที</span>
                                        <span>· ใช้ใน {c.widget_ids.length} Widget</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
