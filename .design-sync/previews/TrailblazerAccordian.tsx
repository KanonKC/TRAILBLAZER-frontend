import * as React from "react";
import { TrailblazerAccordian, TrailblazerAccordianTrigger, TrailblazerAccordianContent } from "trailblazer-ui";
import { HelpCircle, Info } from "lucide-react";

export const OverlayOpen = () => (
  <div className="p-6 max-w-md">
    <TrailblazerAccordian defaultOpen>
      <TrailblazerAccordianTrigger>
        <span className="flex items-center gap-2 text-sm font-medium"><HelpCircle className="size-4 text-white/70" /> วิธีตั้งค่าใน OBS</span>
      </TrailblazerAccordianTrigger>
      <TrailblazerAccordianContent>
        <ol className="list-decimal pl-5 text-sm text-white/70 space-y-1">
          <li>ไปที่โปรแกรม OBS จากนั้นไปที่ Sources › Add Source › Browser</li>
          <li>นำลิงก์ไปใส่ไว้ที่ช่อง URL</li>
          <li>กดติ๊กถูกที่ตัวเลือก Control audio via OBS › กด OK</li>
        </ol>
      </TrailblazerAccordianContent>
    </TrailblazerAccordian>
  </div>
);

export const DefaultVariantClosed = () => (
  <div className="p-6 max-w-md">
    <TrailblazerAccordian variant="default">
      <TrailblazerAccordianTrigger variant="default">
        <span className="flex items-center gap-2 text-sm font-medium"><Info className="size-4 text-muted-foreground" /> ตัวแปรที่ใช้ได้</span>
      </TrailblazerAccordianTrigger>
      <TrailblazerAccordianContent variant="default">
        <p className="text-sm text-muted-foreground">{"{user}"}, {"{amount}"}, {"{streamer}"}</p>
      </TrailblazerAccordianContent>
    </TrailblazerAccordian>
  </div>
);
