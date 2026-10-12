import { CanvasList } from "@/features/canvas/components/CanvasList";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Canvas | TRAILBLAZER",
    description: "สร้าง Template สื่อเพื่อแสดงบน Overlay ของ Widget",
};

export default function MyCanvasPage() {
    return (
        <div className="container mx-auto py-6 max-w-5xl">
            <CanvasList />
        </div>
    );
}
