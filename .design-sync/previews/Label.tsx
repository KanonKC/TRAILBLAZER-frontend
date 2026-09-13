import * as React from "react";
import { Label, Checkbox, Input } from "trailblazer-ui";
import { Info } from "lucide-react";

export const WithControl = () => (
  <div className="grid gap-4 p-6 max-w-sm">
    <div className="flex items-center gap-2">
      <Checkbox id="lb-tos" />
      <Label htmlFor="lb-tos">ยอมรับข้อกำหนดการใช้งาน</Label>
    </div>
    <div className="grid gap-2">
      <Label htmlFor="lb-name"><Info className="size-4 text-muted-foreground" /> ชื่อที่แสดง</Label>
      <Input id="lb-name" placeholder="MrJeremy" />
    </div>
  </div>
);

export const Disabled = () => (
  <div className="flex items-center gap-2 p-6">
    <Checkbox id="lb-dis" disabled className="peer" />
    <Label htmlFor="lb-dis">ตัวเลือกนี้ต้องใช้แพ็กเกจ Pro</Label>
  </div>
);
