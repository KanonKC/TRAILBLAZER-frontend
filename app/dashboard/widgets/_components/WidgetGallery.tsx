"use client";

import { MessageSquare, Video, Dices, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ExtendedWidget, listWidgets } from "@/services/widget.service";
import { tbToast } from "@/utils/tbToast";
import { WidgetCard } from "./WidgetCard";

const staticWidgets = [
    {
        slug: "first-word",
        title: "Greeting Message",
        description: "ตอบกลับผู้ใช้งานที่แชทเข้ามาครั้งแรกในสตรีมของคุณโดยอัตโนมัติ",
        icon: MessageSquare,
        href: "/dashboard/widgets/first-word",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20"
    },
    {
        slug: "clip-shoutout",
        title: "Clip Shoutout",
        description: "โปรโมทเพื่อนสตรีมเมอร์ที่มา Raid ด้วยการโชว์คลิปล่าสุดของอัตโนมัติ",
        icon: Video,
        href: "/dashboard/widgets/clip-shoutout",
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20"
    },
    {
        slug: "random-dbd-perk",
        title: "Random DBD Perk",
        description: "สุ่ม Perk Dead by Daylight สำหรับ Survivor และ Killer ผ่านการแลกแต้มช่อง หรือคำสั่งแชท",
        icon: Dices,
        href: "/dashboard/widgets/random-dbd-perk",
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20"
    },
    {
        slug: "drop-image",
        title: "Drop Image",
        description: "ให้ผู้ชมของคุณโชว์รูปภาพบนหน้าจอผ่านการแลกแต้มช่อง",
        icon: ImageIcon,
        href: "/dashboard/widgets/drop-image",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20"
    }
];

interface WidgetGalleryProps {
    initialData: { data: ExtendedWidget[], pagination: any } | null;
}

export const WidgetGallery = ({ initialData }: WidgetGalleryProps) => {
    const [apiWidgets, setApiWidgets] = useState<ExtendedWidget[]>(initialData?.data || []);
    const [isLoading, setIsLoading] = useState(false);

    const fetchWidgets = async () => {
        try {
            const res = await listWidgets();
            setApiWidgets(res.data);
        } catch (error) {
            console.error("Failed to fetch widgets", error);
            tbToast.error({ title: "ไม่สามารถดึงข้อมูลวิดเจ็ตได้" });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && apiWidgets.length === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-[200px] bg-muted rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staticWidgets.map((widget) => {
                const apiWidget = apiWidgets.find(w => w.widget_type_slug === widget.slug);
                return (
                    <WidgetCard
                        key={widget.slug}
                        {...widget}
                        apiWidget={apiWidget}
                        onSuccess={fetchWidgets}
                    />
                );
            })}
        </div>
    );
};
