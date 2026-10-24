"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadHandler } from "../hooks/useRandomPool";
import { neutralFocus } from "../constants";
import { Field } from "./SectionTitle";
import { ItemThumb } from "./ItemThumb";

interface Props {
  busy: boolean;
  upload: UploadHandler;
  submitLabel: string;
  usageLabel: string;
  onCancel?: () => void;
  /** Hide the optional cover image picker (name-only form). Defaults to true. */
  withCover?: boolean;
  onCreate: (input: {
    name: string;
    cover_key: string | null;
    cover_url: string | null;
  }) => Promise<boolean>;
}

export function PoolCreateForm({
  busy,
  upload,
  submitLabel,
  usageLabel,
  onCancel,
  withCover = true,
  onCreate,
}: Props) {
  const [name, setName] = useState("");
  const [cover, setCover] = useState<{ key: string; url: string } | null>(null);
  const [coverError, setCoverError] = useState("");

  function chooseCover(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      setCoverError("รูปใหญ่เกิน 2 MB ลองย่อรูปแล้วเลือกใหม่");
      return;
    }
    setCoverError("");
    void upload(file, "image", (key, url) => setCover({ key, url }));
  }

  async function submit() {
    const created = await onCreate({
      name,
      cover_key: cover?.key ?? null,
      cover_url: cover?.url ?? null,
    });
    if (created) {
      setName("");
      setCover(null);
      onCancel?.();
    }
  }

  return (
    <div className="grid gap-4">
      <p className="text-muted-foreground text-sm">
                      กองสุ่มคือชุดของสิ่งที่ต้องการสุ่ม โดยคุณสามารถสร้างกองสุ่มได้หลายอัน เพื่อสำหรับการสุ่มที่แตกต่่างกันไป
                    </p>
      <Field label="ชื่อกองสุ่ม" htmlFor="new-pool-name">
        
        <Input
          id="new-pool-name"
          className={neutralFocus}
          maxLength={100}
          placeholder="เช่น ของรางวัลสตรีม"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </Field>
      {withCover && (
        <div className="grid gap-2">
          <span className="text-sm leading-none font-medium">
            รูปปก{" "}
            <span className="text-muted-foreground font-normal">
              (ไม่บังคับ)
            </span>
          </span>
          <div className="flex items-center gap-3">
            {cover && (
              <ItemThumb
                url={cover.url}
                alt="รูปปกกองสุ่ม"
                className="size-16"
              />
            )}
            <label className="border-input hover:bg-muted inline-flex h-8 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm font-medium">
              <Upload className="size-4" />
              {cover ? "เปลี่ยนรูปปก" : "เลือกรูปปก"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp,image/avif"
                className="sr-only"
                disabled={busy}
                onChange={(event) => {
                  const selected = event.target.files?.[0];
                  event.target.value = "";
                  if (selected) chooseCover(selected);
                }}
              />
            </label>
            {cover && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="เอารูปปกออก"
                onClick={() => setCover(null)}
              >
                <X />
              </Button>
            )}
          </div>
          <p className="text-muted-foreground text-sm">ขนาดไม่เกิน 2 MB</p>
          {coverError && (
            <p role="alert" className="text-sm text-destructive">
              {coverError}
            </p>
          )}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              ยกเลิก
            </Button>
          )}
          <Button
            type="button"
            disabled={busy || !name.trim()}
            onClick={() => void submit()}
          >
            {busy ? "กำลังสร้าง…" : submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
