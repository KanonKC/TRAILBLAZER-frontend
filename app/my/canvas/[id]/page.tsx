import { CanvasEditor } from "@/features/canvas/components/CanvasEditor";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "แก้ไข Canvas | TRAILBLAZER",
};

export default async function MyCanvasEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="container mx-auto py-6 max-w-5xl">
            <CanvasEditor key={id} canvasId={id === "new" ? null : id} />
        </div>
    );
}
