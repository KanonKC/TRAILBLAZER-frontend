"use client";

import { ImagePlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PoolItem } from "../types";
import { FOCUS_RING, MAX_POOL_ITEMS } from "../constants";
import { cn } from "@/lib/utils";
import { ItemThumb } from "./ItemThumb";

/** Item cards per row: never fewer than 4 and never more than 10, 120px wide when there is room. */
const ITEMS_PER_ROW = { min: 4, max: 10 };
const GRID_GAP_PX = 12;
/** Keeps four cards on one row even when widths round up by a fraction of a pixel. */
const SUBPIXEL_SAFETY_PX = 4;
const ITEM_COLUMNS = `repeat(auto-fill, minmax(max(min(120px, calc((100% - ${(ITEMS_PER_ROW.min - 1) * GRID_GAP_PX + SUBPIXEL_SAFETY_PX}px) / ${ITEMS_PER_ROW.min})), calc((100% - ${(ITEMS_PER_ROW.max - 1) * GRID_GAP_PX}px) / ${ITEMS_PER_ROW.max})), 1fr))`;

export function PoolItemsGrid({
  items,
  busy,
  onEdit,
  onAdd,
}: {
  items: PoolItem[];
  busy: boolean;
  onEdit: (index: number) => void;
  onAdd: () => void;
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
      <div className="grid gap-3" style={{ gridTemplateColumns: ITEM_COLUMNS }}>
        {items.map((item, index) => (
          <button
            key={item.id ?? `new-${index}`}
            type="button"
            aria-label={
              item.name ? `แก้ไขรายการ ${item.name}` : "แก้ไขรายการที่ไม่มีชื่อ"
            }
            onClick={() => onEdit(index)}
            className={cn(
              "bg-card hover:bg-secondary grid min-w-0 content-start gap-2 rounded-lg border p-2 text-left",
              FOCUS_RING,
            )}
          >
            <ItemThumb
              url={item.image_url}
              alt={item.name || "รายการ"}
              className="w-full"
            />
            {item.name ? (
              <span className="truncate text-sm font-medium">{item.name}</span>
            ) : (
              <span className="text-muted-foreground truncate text-sm italic">
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
          className={cn(
            "text-muted-foreground hover:text-foreground grid min-h-28 place-content-center justify-items-center gap-1 rounded-lg border border-dashed p-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50",
            FOCUS_RING,
          )}
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
