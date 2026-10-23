"use client";

import { useState } from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { RandomPoolController } from "../hooks/useRandomPool";
import { MAX_CONFIGS } from "../constants";

/** Dropdown at the top of the edit view for jumping between configs. */
export function ConfigSwitcher({
  controller,
}: {
  controller: RandomPoolController;
}) {
  const [open, setOpen] = useState(false);
  const { data, editingId, isNewConfig, draft, savedConfig } = controller;
  const configs = data.configs.data;
  const enabled = savedConfig?.widget.enabled ?? false;
  const status = isNewConfig
    ? "ยังไม่ได้บันทึก"
    : enabled
      ? "เปิดอยู่"
      : "ปิดอยู่";

  return (
    <div className="grid gap-2">
      <span className="text-sm leading-none font-medium">
        การตั้งค่าที่กำลังแก้ไข
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="เลือกการตั้งค่า"
            className="border-input hover:bg-muted/40 focus-visible:ring-foreground/30 flex h-9 w-full items-center justify-between gap-2 rounded-md border px-3 text-left text-sm outline-none focus-visible:ring-[3px]"
          >
            <span className="truncate">
              {draft.name || "การตั้งค่าใหม่"}
              <span className="text-muted-foreground">
                {" "}
                · {status} · {configs.length + (isNewConfig ? 1 : 0)} /{" "}
                {MAX_CONFIGS}
              </span>
            </span>
            <ChevronDown className="text-muted-foreground size-4 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-(--radix-popover-trigger-width) p-1"
        >
          <div role="listbox" aria-label="การตั้งค่าทั้งหมด" className="grid">
            {configs.map((config) => (
              <button
                key={config.id}
                type="button"
                role="option"
                aria-selected={config.id === editingId}
                className={cn(
                  "hover:bg-muted flex items-center gap-3 rounded-md px-3 py-2 text-left outline-none",
                  config.id === editingId && "bg-muted",
                )}
                onClick={() => {
                  controller.selectConfig(config.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "size-4 shrink-0",
                    config.id === editingId ? "visible" : "invisible",
                  )}
                />
                <span className="grid min-w-0 flex-1">
                  <span className="truncate text-sm font-medium">
                    {config.name}
                  </span>
                  <span className="text-muted-foreground truncate text-sm">
                    กองสุ่ม: {config.pool?.name ?? "ยังไม่ได้เลือก"}
                  </span>
                </span>
                <span
                  className={cn(
                    "text-sm",
                    config.widget.enabled
                      ? "text-emerald-400"
                      : "text-muted-foreground",
                  )}
                >
                  {config.widget.enabled ? "เปิดอยู่" : "ปิดอยู่"}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-1 flex items-center justify-between gap-2 border-t px-3 pt-2 pb-1">
            <span className="text-muted-foreground text-sm tabular-nums">
              สร้างแล้ว {configs.length} จาก {MAX_CONFIGS} การตั้งค่า
            </span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={configs.length >= MAX_CONFIGS}
              onClick={() => {
                controller.startNewConfig();
                setOpen(false);
              }}
            >
              <Plus />
              สร้างการตั้งค่าใหม่
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
