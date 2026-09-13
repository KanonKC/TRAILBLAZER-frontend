import * as React from "react";
import { Switch, Label } from "trailblazer-ui";

export const States = () => (
  <div className="grid gap-4 p-6">
    <div className="flex items-center gap-3"><Switch id="sw1" /><Label htmlFor="sw1">ปิด</Label></div>
    <div className="flex items-center gap-3"><Switch id="sw2" defaultChecked /><Label htmlFor="sw2">เปิด</Label></div>
    <div className="flex items-center gap-3"><Switch id="sw3" disabled /><Label htmlFor="sw3">ปิดใช้งาน</Label></div>
    <div className="flex items-center gap-3"><Switch id="sw4" disabled defaultChecked /><Label htmlFor="sw4">ปิดใช้งาน (เปิดอยู่)</Label></div>
  </div>
);

export const SettingRow = () => (
  <div className="p-6 max-w-sm">
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="grid gap-1">
        <Label htmlFor="sw5">เปิดใช้งานวิดเจ็ต</Label>
        <p className="text-sm text-muted-foreground">Clip Shoutout จะทำงานเมื่อมีการ shoutout</p>
      </div>
      <Switch id="sw5" defaultChecked />
    </div>
  </div>
);
