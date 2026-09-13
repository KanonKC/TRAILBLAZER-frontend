import * as React from "react";
import { Textarea, Label } from "trailblazer-ui";

export const Basic = () => (
  <div className="grid gap-2 max-w-md p-6">
    <Label htmlFor="ta-msg">ข้อความตอบกลับ</Label>
    <Textarea id="ta-msg" rows={3} placeholder="ขอบคุณ {user} สำหรับ {amount} bits!" />
  </div>
);

export const Filled = () => (
  <div className="grid gap-2 max-w-md p-6">
    <Textarea defaultValue={"ขอบคุณ {user} สำหรับ {amount} bits!\nไปตามดู {streamer} ได้ที่ twitch.tv/{streamer} นะครับ"} />
  </div>
);

export const States = () => (
  <div className="grid gap-3 max-w-md p-6">
    <Textarea defaultValue="ข้อความยาวเกิน 500 ตัวอักษร…" aria-invalid rows={2} />
    <Textarea disabled placeholder="ปิดใช้งาน" rows={2} />
  </div>
);
