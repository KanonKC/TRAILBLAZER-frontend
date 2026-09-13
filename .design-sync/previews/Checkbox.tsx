import * as React from "react";
import { Checkbox, Label } from "trailblazer-ui";

export const States = () => (
  <div className="grid gap-3 p-6">
    <div className="flex items-center gap-2"><Checkbox id="cb1" /><Label htmlFor="cb1">ยังไม่เลือก</Label></div>
    <div className="flex items-center gap-2"><Checkbox id="cb2" defaultChecked /><Label htmlFor="cb2">เลือกแล้ว</Label></div>
    <div className="flex items-center gap-2"><Checkbox id="cb3" disabled /><Label htmlFor="cb3">ปิดใช้งาน</Label></div>
    <div className="flex items-center gap-2"><Checkbox id="cb4" disabled defaultChecked /><Label htmlFor="cb4">ปิดใช้งาน (เลือกแล้ว)</Label></div>
    <div className="flex items-center gap-2"><Checkbox id="cb5" aria-invalid /><Label htmlFor="cb5">ต้องยอมรับข้อกำหนด</Label></div>
  </div>
);

export const NotificationList = () => (
  <div className="grid gap-3 p-6 max-w-sm">
    <p className="text-sm font-medium">แจ้งเตือนเมื่อ</p>
    <div className="flex items-center gap-2"><Checkbox id="n1" defaultChecked /><Label htmlFor="n1">มี raid เข้ามา</Label></div>
    <div className="flex items-center gap-2"><Checkbox id="n2" defaultChecked /><Label htmlFor="n2">มี sub ใหม่</Label></div>
    <div className="flex items-center gap-2"><Checkbox id="n3" /><Label htmlFor="n3">มีคน cheer bits</Label></div>
  </div>
);
