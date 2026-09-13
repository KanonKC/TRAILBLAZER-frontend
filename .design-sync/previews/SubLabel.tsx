import * as React from "react";
import { SubLabel, Label, Switch, Input } from "trailblazer-ui";

export const UnderLabel = () => (
  <div className="p-6 grid gap-4 max-w-sm">
    <div className="grid gap-1">
      <Label>โปรไฟล์บอท</Label>
      <SubLabel>ข้อความในแชทจะถูกส่งจากบัญชีนี้</SubLabel>
    </div>
    <div className="flex items-center justify-between">
      <div className="grid gap-1">
        <Label htmlFor="sl-sw">เล่นเสียงอัตโนมัติ</Label>
        <SubLabel>ใช้กับทุกอีเวนต์</SubLabel>
      </div>
      <Switch id="sl-sw" defaultChecked />
    </div>
  </div>
);

export const UnderInput = () => (
  <div className="p-6 grid gap-2 max-w-sm">
    <Label htmlFor="sl-in">ระยะเวลา (วินาที)</Label>
    <Input id="sl-in" type="number" defaultValue={30} />
    <SubLabel>คลิปจะถูกตัดเมื่อครบเวลาที่กำหนด</SubLabel>
  </div>
);
