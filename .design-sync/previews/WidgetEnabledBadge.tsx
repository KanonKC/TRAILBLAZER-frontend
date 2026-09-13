import * as React from "react";
import { WidgetEnabledBadge } from "trailblazer-ui";

export const Default = () => (
  <div className="p-6 grid gap-3">
    <WidgetEnabledBadge />
    <p className="text-sm text-muted-foreground">วิดเจ็ตนี้กำลังทำงานอยู่บน overlay ของคุณ</p>
  </div>
);
