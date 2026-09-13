import * as React from "react";
import { ScrollArea, ScrollBar, Separator } from "trailblazer-ui";

const files = ["raid-alert.mp3", "sub-hype.mp3", "bits-100.mp3", "bits-1000.mp3", "follow-chime.mp3", "shoutout-intro.mp3", "killer-reveal.mp3", "perk-reveal.mp3", "song-request.mp3", "hydrate.mp3", "goodnight.mp3", "intro-jingle.mp3"];

export const VerticalList = () => (
  <div className="p-6">
    <ScrollArea className="h-56 w-72 rounded-md border">
      <div className="p-3">
        <p className="mb-2 text-sm font-medium">ไฟล์เสียงที่อัปโหลด</p>
        {files.map((f) => (
          <React.Fragment key={f}>
            <div className="py-1.5 text-sm font-mono">{f}</div>
            <Separator />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  </div>
);

export const Horizontal = () => (
  <div className="p-6">
    <ScrollArea className="w-96 rounded-md border whitespace-nowrap">
      <div className="flex w-max gap-3 p-3">
        {files.slice(0, 8).map((f) => (
          <div key={f} className="h-24 w-36 shrink-0 rounded-md bg-muted flex items-end p-2 text-xs text-muted-foreground">{f}</div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </div>
);
