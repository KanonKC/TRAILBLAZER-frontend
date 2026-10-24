"use client";

import { ImagePlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PoolItem } from "../types";
import { MAX_POOL_ITEMS } from "../constants";
import { ItemThumb } from "./ItemThumb";

export function PoolItemsGrid({
  items,
  busy,
  onEdit,
  onAdd,
  columns = "auto",
}: {
  items: PoolItem[];
  busy: boolean;
  onEdit: (index: number) => void;
  onAdd: () => void;
  columns?: "auto" | "five";
}) {
  const full = items.length >= MAX_POOL_ITEMS;

  if (!items.length) {
    return (
      <div className="text-muted-foreground grid place-items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center">
        <ImagePlus className="size-6" aria-hidden="true" />
        <span className="text-foreground text-sm font-medium">
          ยังไม่มีรายการในกองสุ่มนี้
        </span>
        <span className="text-sm">
          เพิ่มรูปหรือชื่ออย่างน้อย 1 อัน (รูปไม่เกิน 2 MB)
        </span>
        <Button type="button" disabled={busy} onClick={onAdd}>
          <Plus />
          เพิ่มรายการแรก
        </Button>
      </div>
    );
  }

  return (
    <>
      <div
        className={
          columns === "five"
            ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
            : "grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3"
        }
      >
        {items.map((item, index) => (
          <button
            key={item.id ?? `new-${index}`}
            type="button"
            aria-label={
              item.name ? `แก้ไขรายการ ${item.name}` : "แก้ไขรายการที่ไม่มีชื่อ"
            }
            onClick={() => onEdit(index)}
            className="bg-muted/40 hover:border-muted-foreground focus-visible:ring-foreground/40 grid min-w-0 content-start gap-2 rounded-lg border p-2 text-left outline-none focus-visible:ring-2"
          >
            <ItemThumb
              url={item.image_url}
              alt={item.name || "รายการ"}
              className="w-full"
            />
            {item.name ? (
              <span className="truncate text-sm font-medium">{item.name}</span>
            ) : (
              <span className="text-muted-foreground text-sm italic">
                ไม่มีชื่อ
              </span>
            )}
          </button>
        ))}
        <button
          type="button"
          disabled={busy || full}
          onClick={onAdd}
          aria-label="เพิ่มรายการ"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-foreground/40 grid min-h-28 place-content-center justify-items-center gap-1 rounded-lg border border-dashed p-2 text-sm font-medium outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="size-5" aria-hidden="true" />
          เพิ่มรายการ
        </button>
      </div>
      {full && (
        <p className="text-sm text-warning">
          กองสุ่มนี้ครบ {MAX_POOL_ITEMS} รายการแล้ว
          ลบรายการเดิมก่อนถึงจะเพิ่มได้
        </p>
      )}
    </>
  );
}
