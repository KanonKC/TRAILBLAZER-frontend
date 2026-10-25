"use client";

import { CharacterCountTextarea } from "@/components/widget/CharacterCountTextarea";
import { CHAT_VARIABLES, MAX_CHAT_MESSAGE_LENGTH } from "../constants";
import { Field } from "./SectionTitle";

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
    <Field
      label="ข้อความประกาศผลเริ่มต้น"
      help="บอทพิมพ์ข้อความนี้ลงแชทหลังสุ่มเสร็จ ถ้าไม่ใส่ บอทจะไม่พิมพ์อะไร"
    >
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
    </Field>
  );
}
