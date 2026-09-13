import * as React from "react";
import { ReplyMessageTextarea } from "trailblazer-ui";

const variables = [
  { variable: "{user}", description: "ชื่อผู้ชมที่ทริกเกอร์อีเวนต์", example: "MrJeremy" },
  { variable: "{amount}", description: "จำนวน bits ที่ cheer", example: "500" },
];

export const WithVariables = () => (
  <div className="p-6 max-w-lg">
    <ReplyMessageTextarea value="ขอบคุณ {user} สำหรับ {amount} bits! 🔥" onChange={() => {}} variables={variables} placeholder="ข้อความตอบกลับ" defaultOpenHelp />
  </div>
);

export const Plain = () => (
  <div className="p-6 max-w-lg">
    <ReplyMessageTextarea value="" onChange={() => {}} placeholder="พิมพ์ข้อความที่บอทจะตอบในแชท" />
  </div>
);

export const ErrorState = () => (
  <div className="p-6 max-w-lg">
    <ReplyMessageTextarea value={"ขอบคุณ {user} มากๆ สำหรับ {amount} bits! ".repeat(14)} onChange={() => {}} error="ข้อความยาวเกิน 500 ตัวอักษร" />
  </div>
);

export const DefaultVariant = () => (
  <div className="p-6 max-w-lg">
    <ReplyMessageTextarea variant="default" value="ไปตามดู {streamer} ได้ที่ twitch.tv/{streamer}" onChange={() => {}} />
  </div>
);
