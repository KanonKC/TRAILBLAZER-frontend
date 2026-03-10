"use client";

import { MessageSquare, Video, Dices, Image as ImageIcon, Lock } from "lucide-react";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useUser } from "@/components/user-context";

const widgets = [
    {
        id: "first-word",
        title: "Greeting Message",
        description: "ตอบกลับผู้ใช้งานที่แชทเข้ามาครั้งแรกในสตรีมของคุณโดยอัตโนมัติ",
        icon: MessageSquare,
        href: "/dashboard/widgets/first-word",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20"
    },
    {
        id: "clip-shoutout",
        title: "Clip Shoutout",
        description: "โปรโมทเพื่อนสตรีมเมอร์ที่มา Raid ด้วยการโชว์คลิปล่าสุดของอัตโนมัติ",
        icon: Video,
        href: "/dashboard/widgets/clip-shoutout",
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20"
    },
    {
        id: "random-dbd-perk",
        title: "Random DBD Perk",
        description: "สุ่ม Perk Dead by Daylight สำหรับ Survivor และ Killer ผ่านการแลก Channel Points หรือคำสั่งแชท",
        icon: Dices,
        href: "/dashboard/widgets/random-dbd-perk",
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20"
    },
    {
        id: "drop-image",
        title: "Drop Image",
        description: "ให้ผู้ชมของคุณโชว์รูปภาพบนหน้าจอผ่านการแลก Channel Points",
        icon: ImageIcon,
        href: "/dashboard/widgets/drop-image",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20"
    }
];

export default function WidgetsPage() {
    const { user } = useUser();
    const currentTier = user?.tier || 0;

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Widget Gallery</h1>
                <p className="text-muted-foreground">
                    เลือกวิดเจ็ตที่คุณต้องการใช้งานเพื่อเสริมประสบการณ์การสตรีมของคุณ
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {widgets.map((widget) => {
                    const isLocked = currentTier < widget.requiredTier;

                    const CardComponent = (
                        <Card className={`h-full transition-all ${isLocked ? 'opacity-70 grayscale-[0.5]' : 'hover:border-primary/50 hover:shadow-md cursor-pointer group'} relative overflow-hidden`}>
                            {isLocked && (
                                <div className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm shadow-sm border">
                                    <Lock className="w-4 h-4 text-muted-foreground" />
                                </div>
                            )}
                            <CardHeader>
                                <div className="flex items-center gap-4 mb-2">
                                    <div className={`p-3 rounded-xl ${widget.bgColor} ${widget.color} ${!isLocked && 'group-hover:scale-110'} transition-transform`}>
                                        <widget.icon className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-xl transition-colors">
                                        {widget.title}
                                    </CardTitle>
                                </div>
                                <CardDescription className="text-base">
                                    {widget.description}
                                </CardDescription>
                            </CardHeader>
                            {isLocked && (
                                <CardContent className="mt-auto">
                                    <div className="text-sm font-medium text-amber-500/90 bg-amber-500/10 px-3 py-1.5 rounded-md inline-block">
                                        Requires Pro Tier
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    );

                    if (isLocked) {
                        return <div key={widget.id} className="cursor-not-allowed">{CardComponent}</div>;
                    }

                    return (
                        <Link key={widget.id} href={widget.href}>
                            {CardComponent}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
