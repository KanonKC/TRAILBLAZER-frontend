"use client";

import { useState } from "react";
import { AlertCircle, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadHandler } from "../hooks/useRandomPool";
import { Label } from "@/components/ui/label";
import SubLabel from "@/components/SubLabel";
import { cn } from "@/lib/utils";
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
    <div className="grid gap-6">
      <div className="space-y-2">
        <Label htmlFor="new-pool-name">ชื่อกองสุ่ม</Label>
        <SubLabel>ตั้งชื่อให้จำง่าย โดยเฉพาะถ้าคุณมีหลายกองสุ่ม</SubLabel>
        <Input
          id="new-pool-name"
          maxLength={100}
          placeholder="เช่น ของรางวัลสตรีม"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      {withCover && (
        <div className="space-y-2">
          <Label>รูปปก</Label>
          <SubLabel>ไม่บังคับ ขนาดไม่เกิน 2 MB</SubLabel>
          <div className="flex items-center gap-3">
            {cover && (
              <ItemThumb
                url={cover.url}
                alt="รูปปกกองสุ่ม"
                className="size-16"
              />
            )}
            <Button
              asChild
              variant="outline"
              className={cn(
                "bg-secondary text-foreground border-border hover:bg-secondary hover:text-primary has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
                busy && "pointer-events-none opacity-50",
              )}
            >
              <label>
                <Upload />
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
            </Button>
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
          {coverError && (
            <p
              role="alert"
              className="flex items-center gap-1.5 text-sm font-medium text-destructive"
            >
              <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
              {coverError}
            </p>
          )}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SubLabel>{usageLabel}</SubLabel>
        <div className="flex gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              className="bg-secondary text-foreground border-border hover:bg-secondary hover:text-primary"
              disabled={busy}
              onClick={onCancel}
            >
              ยกเลิก
            </Button>
          )}
          <Button
            type="button"
            disabled={busy || !name.trim()}
            onClick={() => void submit()}
          >
            {busy ? (
              <>
                <Loader2 className="animate-spin" /> กำลังสร้าง...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
