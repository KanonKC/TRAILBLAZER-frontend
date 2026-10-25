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
    color: "bg-primary/10 text-primary",
    title: "กองสุ่มของคุณเอง",
    description:
      "สร้างกองของรางวัลจากรูปและชื่อ ใส่ได้สูงสุด 50 รายการต่อกองสุ่ม",
  },
  {
    icon: Scale,
    color: "bg-violet/10 text-violet",
    title: "สุ่มเท่ากันหรือถ่วงน้ำหนัก",
    description:
      "ให้ทุกรายการมีโอกาสเท่ากัน หรือตั้งน้ำหนักให้ของหายากออกยากขึ้น",
  },
  {
    icon: Shuffle,
    color: "bg-info/10 text-info",
    title: "Animation 3 แบบ",
    description:
      "สลับรูป เลื่อนแถบ หรือหมุนวงล้อ แล้วค่อยๆ ช้าลงจนหยุดที่ผลลัพธ์",
  },
  {
    icon: MessageSquare,
    color: "bg-teal/10 text-teal",
    title: "ข้อความแชทพร้อมตัวแปร",
    description: "ประกาศผลลงแชท ใส่ชื่อคนแลกและชื่อของที่ได้ด้วยตัวแปร",
  },
];

export function OverviewTab({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <WidgetOverviewCard showLoginButton={!isLoggedIn}>
      <p className="text-base leading-relaxed text-foreground">
        อยากให้คนดูแลก Channel Points แล้วลุ้นของแบบมีลูกเล่นไหม Random Pool
        ให้คุณสร้างกองของรางวัลของตัวเองจากรูปและชื่อ
        พอคนดูแลกแต้มระบบจะสุ่มให้ทันที รูปหมุนขึ้นจอใน OBS
        และบอทพิมพ์ผลลงแชทให้เอง ไม่ต้องจับฉลากเอง ไม่ต้องพิมพ์ผลเอง
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {features.map(({ icon: Icon, color, title, description }) => (
          <div
            key={title}
            className="bg-card rounded-xl border p-4"
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
