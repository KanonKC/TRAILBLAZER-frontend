"use client";

import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CHAT_VARIABLES,
  MAX_CHAT_MESSAGE_LENGTH,
  neutralFocus,
} from "../constants";
import { Field } from "./SectionTitle";

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
      htmlFor="config-chat"
      help="บอทพิมพ์ข้อความนี้ลงแชทหลังสุ่มเสร็จ ถ้าไม่ใส่ บอทจะไม่พิมพ์อะไร"
    >
      <div className="relative">
        <Textarea
          id="config-chat"
          rows={3}
          className={`${neutralFocus} pb-7`}
          aria-invalid={over}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <span
          className={`pointer-events-none absolute right-3 bottom-2 text-sm tabular-nums ${over ? "text-red-300" : "text-muted-foreground"}`}
        >
          {value.length}/{MAX_CHAT_MESSAGE_LENGTH}
        </span>
      </div>
      {over && (
        <p className="text-sm text-red-300">
          ข้อความต้องไม่เกิน {MAX_CHAT_MESSAGE_LENGTH} ตัวอักษร
        </p>
      )}
      <Accordion
        type="single"
        collapsible
        defaultValue="variables"
        className="rounded-lg border"
      >
        <AccordionItem value="variables" className="border-none">
          <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
            ตัวแปรที่ใช้ได้ (Variables)
          </AccordionTrigger>
          <AccordionContent className="grid gap-3 px-4 pb-4">
            <p className="text-muted-foreground text-sm">
              กดที่ตัวแปรเพื่อเพิ่มลงท้ายข้อความ หรือพิมพ์เองได้เลย
            </p>
            {CHAT_VARIABLES.map((variable) => (
              <div
                key={variable.token}
                className="flex items-center justify-between gap-3"
              >
                <div className="grid text-sm">
                  <span>{variable.description}</span>
                  <span className="text-muted-foreground">
                    ตัวอย่าง: <i>&quot;{variable.example}&quot;</i>
                  </span>
                </div>
                <button
                  type="button"
                  className="hover:border-foreground focus-visible:ring-foreground/40 rounded-md border px-2 py-1 font-mono text-sm outline-none focus-visible:ring-2"
                  onClick={() => onChange(value + variable.token)}
                >
                  {variable.token}
                </button>
              </div>
            ))}
            <p className="text-muted-foreground text-sm">
              ถ้าข้อความหลังแทนตัวแปรยาวเกิน {MAX_CHAT_MESSAGE_LENGTH} ตัวอักษร
              ระบบจะตัดที่ {MAX_CHAT_MESSAGE_LENGTH}
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Field>
  );
}
