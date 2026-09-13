import * as React from "react";
import { Separator } from "trailblazer-ui";

export const Horizontal = () => (
  <div className="p-6 max-w-sm">
    <div>
      <p className="text-sm font-medium">Clip Shoutout</p>
      <p className="text-sm text-muted-foreground">เล่นคลิปเมื่อมีการ shoutout</p>
    </div>
    <Separator className="my-4" />
    <div>
      <p className="text-sm font-medium">Random DBD Killer</p>
      <p className="text-sm text-muted-foreground">สุ่มคิลเลอร์จาก channel points</p>
    </div>
  </div>
);

export const Vertical = () => (
  <div className="p-6">
    <div className="flex h-5 items-center gap-4 text-sm">
      <span>Overlay</span>
      <Separator orientation="vertical" />
      <span>Chat</span>
      <Separator orientation="vertical" />
      <span>Discord</span>
    </div>
  </div>
);
