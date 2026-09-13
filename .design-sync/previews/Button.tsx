import * as React from "react";
import { Button } from "trailblazer-ui";
import { Play, Trash, Settings, Plus, ExternalLink } from "lucide-react";

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-2 p-6">
    <Button>บันทึกการเปลี่ยนแปลง</Button>
    <Button variant="outline"><Play data-icon="inline-start" /> Test</Button>
    <Button variant="secondary">ยกเลิก</Button>
    <Button variant="ghost">ดูเพิ่มเติม</Button>
    <Button variant="destructive"><Trash data-icon="inline-start" /> ลบวิดเจ็ต</Button>
    <Button variant="link">นโยบายความเป็นส่วนตัว</Button>
    <Button variant="twitch">Login with Twitch</Button>
  </div>
);

export const Sizes = () => (
  <div className="flex flex-wrap items-center gap-2 p-6">
    <Button size="xs">Extra small</Button>
    <Button size="sm">Small</Button>
    <Button>Default</Button>
    <Button size="lg">Large</Button>
    <Button size="icon-xs" aria-label="Add"><Plus /></Button>
    <Button size="icon-sm" aria-label="Add"><Plus /></Button>
    <Button size="icon" aria-label="Settings"><Settings /></Button>
    <Button size="icon-lg" aria-label="Settings"><Settings /></Button>
  </div>
);

export const WithIcons = () => (
  <div className="flex flex-wrap items-center gap-2 p-6">
    <Button><Plus data-icon="inline-start" /> เพิ่มวิดเจ็ต</Button>
    <Button variant="outline">เปิดใน OBS <ExternalLink data-icon="inline-end" /></Button>
    <Button variant="ghost" size="sm"><Settings data-icon="inline-start" /> ตั้งค่า</Button>
  </div>
);

export const States = () => (
  <div className="flex flex-wrap items-center gap-2 p-6">
    <Button disabled>กำลังบันทึก...</Button>
    <Button variant="outline" disabled>Testing...</Button>
    <Button variant="destructive" disabled>ลบวิดเจ็ต</Button>
    <Button asChild><a href="#pricing">ดูแพ็กเกจ (asChild link)</a></Button>
  </div>
);
