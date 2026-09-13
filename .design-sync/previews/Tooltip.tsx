import * as React from "react";
import { Tooltip, TooltipTrigger, TooltipContent, Button } from "trailblazer-ui";
import { RefreshCcw, Copy } from "lucide-react";

export const Open = () => (
  <div className="p-6 pt-20 min-h-64 flex gap-4">
    <Tooltip open>
      <TooltipTrigger asChild><Button variant="ghost" size="icon" aria-label="Refresh"><RefreshCcw /></Button></TooltipTrigger>
      <TooltipContent>สร้าง URL ใหม่</TooltipContent>
    </Tooltip>
    <Tooltip open>
      <TooltipTrigger asChild><Button variant="outline"><Copy data-icon="inline-start" /> คัดลอก</Button></TooltipTrigger>
      <TooltipContent side="bottom">คัดลอก Overlay URL ไปยังคลิปบอร์ด</TooltipContent>
    </Tooltip>
  </div>
);
