"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PoolDraft } from "../types";
import { usePoolEditor } from "../hooks/usePoolEditor";
import {
  Globe2,
  ImageIcon,
  LockKeyhole,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

interface Props {
  value: PoolDraft;
  onChange: (pool: PoolDraft) => void;
  disabled: boolean;
  upload: (
    file: File,
    kind: "image" | "audio",
    onUploaded: (key: string, url: string) => void,
  ) => Promise<void>;
  actions?: ReactNode;
}

function Photo({
  url,
  alt,
  className,
}: {
  url?: string | null;
  alt: string;
  className: string;
}) {
  return url ? (
    <Image
      unoptimized
      src={url}
      alt={alt}
      width={640}
      height={480}
      className={className}
    />
  ) : (
    <div
      className={`${className} flex items-center justify-center bg-[#2b3444] text-[#68778e]`}
    >
      <ImageIcon className="size-10" aria-hidden="true" />
    </div>
  );
}

export function PoolEditor({
  value,
  onChange,
  disabled,
  upload,
  actions,
}: Props) {
  const editor = usePoolEditor(value, onChange);
  const editingItem = editor.editingIndex !== null;
  const canSaveItem = Boolean(
    editor.itemDraft.name?.trim() || editor.itemDraft.image_key,
  );

  async function uploadImage(file: File, target: "cover" | "item") {
    if (!editor.validateImage(file)) return;
    await upload(file, "image", (key, url) => {
      if (target === "cover")
        onChange({ ...value, cover_key: key, cover_url: url });
      else
        editor.setItemDraft((previous) => ({
          ...previous,
          image_key: key,
          image_url: url,
        }));
    });
  }

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(270px,340px)_minmax(0,1fr)]">
      <section
        className="space-y-6 rounded-2xl border border-white/10 bg-[#151821] p-5 sm:p-6"
        aria-label="รายละเอียด Pool"
      >
        <div>
          <Label
            htmlFor="pool-cover"
            className="mb-3 block text-base font-semibold text-white"
          >
            รูปปก{" "}
            <span className="font-normal text-[#9ca5b8]">(ไม่บังคับ)</span>
          </Label>
          <Photo
            url={value.cover_url}
            alt="รูปปก Pool"
            className="aspect-[4/3] w-full rounded-xl object-cover"
          />
          <div className="mt-3 flex items-center gap-2">
            <label
              htmlFor="pool-cover"
              className="inline-flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/15 bg-[#242b38] px-3 text-sm font-medium text-white hover:bg-[#30394a]"
            >
              <Upload className="size-4" />
              {value.cover_key ? "เปลี่ยนรูป" : "เลือกรูปปก"}
            </label>
            <Input
              id="pool-cover"
              className="sr-only"
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp,image/avif"
              disabled={disabled}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadImage(file, "cover");
                event.target.value = "";
              }}
            />
            {value.cover_key && (
              <Button
                type="button"
                variant="ghost"
                className="text-[#c9d0dd]"
                disabled={disabled}
                onClick={() =>
                  onChange({ ...value, cover_key: null, cover_url: null })
                }
              >
                ลบรูปปก
              </Button>
            )}
          </div>
          <p className="mt-2 text-sm text-[#9ca5b8]">
            ถ้าไม่ใส่ จะใช้รูปของ Item 4 รูปแรกเป็นปกให้
          </p>
          {!editingItem && editor.fileError && (
            <p role="alert" className="mt-2 text-sm text-red-300">
              {editor.fileError}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="pool-name"
            className="text-base font-semibold text-white"
          >
            ชื่อ Pool
          </Label>
          <Input
            id="pool-name"
            value={value.name}
            maxLength={100}
            placeholder="เช่น ของรางวัลเดือนตุลา"
            disabled={disabled}
            className="min-h-11 border-white/20 bg-[#242b38] text-white placeholder:text-[#7e889a]"
            onChange={(event) =>
              onChange({ ...value, name: event.target.value })
            }
          />
          <p className="text-sm text-[#9ca5b8]">
            ตั้งชื่อให้จำง่าย คุณจะเห็นชื่อนี้ตอนเลือก Pool ใน Config
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-base font-semibold text-white">การมองเห็น</p>
          <div className="flex items-start gap-3 rounded-xl border border-[#e8943a]/60 bg-[#e8943a]/10 p-3 text-white">
            <LockKeyhole className="mt-0.5 size-5 text-[#efa94b]" />
            <div>
              <strong className="block text-sm">Private</strong>
              <span className="text-sm text-[#aeb7c8]">
                เห็นและใช้ได้เฉพาะคุณ
              </span>
            </div>
          </div>
          <div
            className="flex items-start gap-3 rounded-xl border border-white/10 p-3 text-[#768196]"
            aria-disabled="true"
          >
            <Globe2 className="mt-0.5 size-5" />
            <div>
              <strong className="block text-sm">Public · Coming soon</strong>
              <span className="text-sm">เปิดให้ Streamer คนอื่นใช้ในอนาคต</span>
            </div>
          </div>
        </div>
        {actions}
      </section>

      <section
        className="min-w-0 rounded-2xl border border-white/10 bg-[#151821] p-5 sm:p-6"
        aria-label="Item ใน Pool"
      >
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Item ใน Pool
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[#9ca5b8]">
              แต่ละ Item ต้องมีรูปหรือชื่ออย่างน้อยหนึ่งอย่าง รูปไม่เกิน 2 MB
              ชื่อไม่เกิน 32 ตัวอักษร
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold text-white">
              {value.items.length} / 50{" "}
              <span className="font-normal text-[#9ca5b8]">Item</span>
            </span>
            <Button
              type="button"
              variant="outline"
              disabled={disabled || value.items.length >= 50 || editingItem}
              className="border-white/15 bg-[#242b38] text-white hover:bg-[#30394a] hover:text-white"
              onClick={editor.startAdd}
            >
              <Plus className="size-4" /> เพิ่ม Item
            </Button>
          </div>
        </div>
        {value.items.length >= 50 && (
          <p className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
            ครบ 50 Item แล้ว ลบ Item เดิมออกก่อนจึงจะเพิ่ม Item ใหม่ได้
          </p>
        )}
        {editingItem && (
          <div className="mb-5 rounded-xl border border-[#e8943a]/60 bg-[#1d222d] p-4 sm:p-5">
            <h3 className="mb-4 text-lg font-semibold text-white">
              {editor.editingIndex === -1 ? "เพิ่ม Item ใหม่" : "แก้ไข Item"}
            </h3>
            <div className="grid gap-5 sm:grid-cols-[160px_minmax(0,1fr)]">
              <div>
                <Label
                  htmlFor="item-image"
                  className="mb-2 block text-sm text-white"
                >
                  รูป
                </Label>
                <Photo
                  url={editor.itemDraft.image_url}
                  alt="ตัวอย่างรูป Item"
                  className="aspect-square w-full rounded-lg object-cover"
                />
                <label
                  htmlFor="item-image"
                  className="mt-2 inline-flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/15 bg-[#242b38] px-2 text-sm text-white"
                >
                  <Upload className="size-4" /> เลือกรูป
                </label>
                <Input
                  id="item-image"
                  className="sr-only"
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp,image/avif"
                  disabled={disabled}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void uploadImage(file, "item");
                    event.target.value = "";
                  }}
                />
                {editor.itemDraft.image_key && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="mt-1 w-full text-[#c9d0dd]"
                    onClick={() =>
                      editor.setItemDraft((previous) => ({
                        ...previous,
                        image_key: null,
                        image_url: null,
                      }))
                    }
                  >
                    ลบรูป
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-name" className="text-sm text-white">
                  ชื่อ Item
                </Label>
                <Input
                  id="item-name"
                  value={editor.itemDraft.name || ""}
                  maxLength={32}
                  placeholder="เช่น สติกเกอร์ลายเซ็น"
                  disabled={disabled}
                  className="min-h-11 border-white/20 bg-[#242b38] text-white placeholder:text-[#7e889a]"
                  onChange={(event) =>
                    editor.setItemDraft((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                />
                <p className="text-sm text-[#9ca5b8]">
                  {editor.itemDraft.name?.length || 0} / 32 ·
                  ใส่รูปหรือชื่ออย่างน้อยหนึ่งอย่าง
                </p>
                {editor.fileError && (
                  <p
                    role="alert"
                    className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300"
                  >
                    {editor.fileError}
                  </p>
                )}
                <div className="flex gap-2 pt-3">
                  <Button
                    type="button"
                    disabled={disabled || !canSaveItem}
                    className="bg-[#e9a33e] text-[#10131a] hover:bg-[#f4b659]"
                    onClick={editor.saveItem}
                  >
                    {editor.editingIndex === -1 ? "เพิ่ม Item" : "บันทึก Item"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-[#c9d0dd]"
                    onClick={editor.cancel}
                  >
                    ยกเลิก
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {!value.items.length && !editingItem ? (
          <div className="rounded-xl border border-dashed border-white/20 px-5 py-14 text-center">
            <ImageIcon className="mx-auto mb-4 size-10 text-[#6f7b8e]" />
            <h3 className="text-lg font-semibold text-white">
              Pool นี้ยังไม่มี Item
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#9ca5b8]">
              เพิ่มรูปหรือชื่ออย่างน้อยหนึ่งอย่างต่อ Item ได้สูงสุด 50 Item ถ้า
              Pool ว่าง Widget จะสุ่มไม่ได้
            </p>
            <Button
              type="button"
              className="mt-5 bg-[#e9a33e] text-[#10131a] hover:bg-[#f4b659]"
              onClick={editor.startAdd}
            >
              <Plus className="size-4" /> เพิ่ม Item แรก
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {value.items.map((item, index) => (
              <article
                key={item.id || `new-${index}`}
                className="overflow-hidden rounded-xl border border-white/10 bg-[#0c0f17]"
              >
                <Photo
                  url={item.image_url}
                  alt={item.name || `Item ${index + 1}`}
                  className="aspect-square w-full object-cover"
                />
                <div className="min-h-16 px-4 py-3">
                  <h3 className="truncate text-base font-semibold text-white">
                    {item.name || "(ไม่มีชื่อ)"}
                  </h3>
                  {!item.image_key && (
                    <span className="text-sm text-[#9ca5b8]">ไม่มีรูป</span>
                  )}
                </div>
                <div className="grid grid-cols-2 border-t border-white/10">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={disabled || editingItem}
                    className="rounded-none border-r border-white/10 text-white hover:bg-[#222936] hover:text-white"
                    onClick={() => editor.startEdit(index)}
                  >
                    <Pencil className="size-4" /> แก้ไข
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={disabled || editingItem}
                    className="rounded-none text-red-300 hover:bg-red-500/10 hover:text-red-200"
                    onClick={() => editor.deleteItem(index)}
                  >
                    <Trash2 className="size-4" /> ลบ
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
