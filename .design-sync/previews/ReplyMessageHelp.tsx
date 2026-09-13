import * as React from "react";
import { ReplyMessageHelp } from "trailblazer-ui";

const variables = [
  { variable: "{user}", description: "ชื่อผู้ชมที่ทริกเกอร์อีเวนต์", example: "MrJeremy" },
  { variable: "{amount}", description: "จำนวน bits ที่ cheer", example: "500" },
  { variable: "{streamer}", description: "ชื่อช่องที่ถูก shoutout", example: "lilypichu" },
];

export const Open = () => (
  <div className="p-6 max-w-lg"><ReplyMessageHelp variables={variables} defaultOpen onInsertVariable={() => {}} /></div>
);

export const Closed = () => (
  <div className="p-6 max-w-lg"><ReplyMessageHelp variables={variables} /></div>
);
