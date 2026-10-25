"use client";

import { CharacterCountTextarea } from "@/components/widget/CharacterCountTextarea";
import { CHAT_VARIABLES, MAX_CHAT_MESSAGE_LENGTH } from "../constants";
import { Label } from "@/components/ui/label";
import SubLabel from "@/components/SubLabel";

const chatVariables = CHAT_VARIABLES.map((variable) => ({
  variable: variable.token,
  title: variable.title,
  description: variable.description,
}));

export function ChatMessageField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const over = value.length > MAX_CHAT_MESSAGE_LENGTH;
  return (
    <div className="space-y-2">
      <Label>ข้อความประกาศผลเริ่มต้น</Label>
      <SubLabel>
        บอทพิมพ์ข้อความนี้ลงแชทหลังสุ่มเสร็จ ถ้าไม่ใส่ บอทจะไม่พิมพ์อะไร
      </SubLabel>
      <CharacterCountTextarea
        defaultOpenHelp
        value={value}
        onChange={onChange}
        variables={chatVariables}
        error={
          over
            ? `ข้อความต้องไม่เกิน ${MAX_CHAT_MESSAGE_LENGTH} ตัวอักษร`
            : null
        }
      />
    </div>
  );
}
