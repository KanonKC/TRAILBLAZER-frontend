"use client";

import { useState } from "react";
import { RandomPoolController } from "../hooks/useRandomPool";
import { MAX_POOL_ITEMS } from "../constants";
import { ALERT_TONE } from "../constants";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EditingItem, ItemSheet } from "./ItemSheet";
import { PoolItemsGrid } from "./PoolItemsGrid";

/** Item grid plus the edit drawer. Edits write to the real pool. */
export function PoolItemsEditor({
  controller,
  columns,
  simple = false,
}: {
  controller: RandomPoolController;
  columns?: "auto" | "five";
  /** Image and name only: hides weight, chat message and sound fields. */
  simple?: boolean;
}) {
  const { poolItems, draft, selectedPool, busy } = controller;
  const [editing, setEditing] = useState<EditingItem | null>(null);

  if (!selectedPool) return null;

  const weighted = draft.mode === "WEIGHTED";
  const totalWeight = poolItems.reduce(
    (sum, item) => sum + controller.weightOf(item.id),
    0,
  );

  function edit(index: number) {
    const item = poolItems[index];
    if (!item?.id) return;
    setEditing({
      index,
      item,
      setting: {
        item_id: item.id,
        weight: controller.weightOf(item.id),
        ...draft.items.find((setting) => setting.item_id === item.id),
      },
    });
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm leading-none font-medium">
          รายการในกองสุ่ม
        </span>
        <span className="text-muted-foreground text-sm tabular-nums">
          {poolItems.length} / {MAX_POOL_ITEMS} รายการ
        </span>
      </div>
      {!poolItems.length && (
        <Alert className={ALERT_TONE.warning.box}>
          <ALERT_TONE.warning.Icon className={ALERT_TONE.warning.text} />
          <AlertTitle className={ALERT_TONE.warning.text}>
            กองสุ่มนี้ยังไม่มีรายการ
          </AlertTitle>
          <AlertDescription className="text-foreground">
            เพิ่มอย่างน้อย 1 รายการก่อน ถึงจะเปิดใช้การตั้งค่านี้ได้
          </AlertDescription>
        </Alert>
      )}
      <PoolItemsGrid
        items={poolItems}
        busy={busy}
        columns={columns}
        onEdit={edit}
        onAdd={() =>
          setEditing({
            index: null,
            item: { name: "", image_key: null, image_url: null },
          })
        }
      />
      <p className="text-muted-foreground text-sm">
        กดที่รูปหรือชื่อเพื่อแก้ไขรายการในหน้าต่างเดียว
        การแก้ที่นี่คือแก้กองสุ่มตัวจริง
        ข้อมูลชุดเดียวกับทุกการตั้งค่าที่ใช้กองสุ่มนี้
      </p>
      <ItemSheet
        editing={editing}
        simple={simple}
        weighted={weighted}
        totalWeight={totalWeight}
        files={controller.files}
        busy={busy}
        upload={controller.upload}
        onClose={() => setEditing(null)}
        onSave={controller.saveItem}
        onDelete={(item) =>
          item.id ? controller.removeItem(item.id) : Promise.resolve(false)
        }
      />
    </div>
  );
}
