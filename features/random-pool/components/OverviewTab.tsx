"use client";

import type { ComponentType } from "react";
import { Boxes, MessageSquare, Scale, Shuffle } from "lucide-react";
import WidgetOverviewCard from "@/components/widget/widget-tab-card/WidgetOverviewCard";

const features: {
  icon: ComponentType<{ className?: string }>;
  color: string;
  title: string;
  description: string;
}[] = [
  {
    icon: Boxes,
    color: "bg-orange-500/10 text-orange-500",
    title: "กองสุ่มของคุณเอง",
    description:
      "สร้างกองของรางวัลจากรูปและชื่อ ใส่ได้สูงสุด 50 รายการต่อกองสุ่ม",
  },
  {
    icon: Scale,
    color: "bg-emerald-500/10 text-emerald-500",
    title: "สุ่มเท่ากันหรือถ่วงน้ำหนัก",
    description:
      "ให้ทุกรายการมีโอกาสเท่ากัน หรือตั้งน้ำหนักให้ของหายากออกยากขึ้น",
  },
  {
    icon: Shuffle,
    color: "bg-sky-500/10 text-sky-500",
    title: "Animation 3 แบบ",
    description:
      "สลับรูป เลื่อนแถบ หรือหมุนวงล้อ แล้วค่อยๆ ช้าลงจนหยุดที่ผลลัพธ์",
  },
  {
    icon: MessageSquare,
    color: "bg-pink-500/10 text-pink-500",
    title: "ข้อความแชทพร้อมตัวแปร",
    description: "ประกาศผลลงแชท ใส่ชื่อคนแลกและชื่อของที่ได้ด้วยตัวแปร",
  },
];

export function OverviewTab({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <WidgetOverviewCard showLoginButton={!isLoggedIn}>
      <p className="text-base leading-relaxed text-gray-200">
        อยากให้คนดูแลก Channel Points แล้วลุ้นของแบบมีลูกเล่นไหม Random Pool
        ให้คุณสร้างกองของรางวัลของตัวเองจากรูปและชื่อ
        พอคนดูแลกแต้มระบบจะสุ่มให้ทันที รูปหมุนขึ้นจอใน OBS
        และบอทพิมพ์ผลลงแชทให้เอง ไม่ต้องจับฉลากเอง ไม่ต้องพิมพ์ผลเอง
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {features.map(({ icon: Icon, color, title, description }) => (
          <div
            key={title}
            className="bg-card hover:bg-accent/5 rounded-xl border p-4 transition-colors"
          >
            <div className={`mb-3 w-fit rounded-lg p-2 ${color}`}>
              <Icon className="size-5" />
            </div>
            <h3 className="mb-1 font-semibold">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        ))}
      </div>
    </WidgetOverviewCard>
  );
}
