"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCanvas } from "@/features/canvas/api/canvas.api";
import { CanvasWithLinks } from "@/features/canvas/types";
import { CanvasEditor } from "@/features/canvas/components/CanvasEditor";

export default function CanvasEditorPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [canvas, setCanvas] = useState<CanvasWithLinks | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        getCanvas(id)
            .then(setCanvas)
            .catch((err) => {
                console.error("Failed to load canvas", err);
                setError(true);
            });
    }, [id]);

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <p className="text-sm text-destructive">ไม่พบ Canvas นี้ หรือคุณไม่มีสิทธิ์เข้าถึง</p>
                <button className="text-sm underline mt-2" onClick={() => router.push("/dashboard/canvas")}>
                    กลับไปหน้ารายการ Canvas
                </button>
            </div>
        );
    }

    if (!canvas) {
        return <div className="max-w-4xl mx-auto p-6 text-sm text-muted-foreground">กำลังโหลด...</div>;
    }

    return <CanvasEditor initialCanvas={canvas} />;
}
