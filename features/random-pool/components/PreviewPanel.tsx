"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, ImageIcon, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RandomPoolController } from "../hooks/useRandomPool";
import {
  DECELERATION,
  PreviewItem,
  SPIN_DURATION_MS,
  TILE_SIZE,
  usePreviewSpin,
  wheelSlices,
} from "../hooks/usePreviewSpin";
import { MAX_CHAT_MESSAGE_LENGTH } from "../constants";
import { ItemThumb } from "./ItemThumb";

function Tile({ item }: { item?: PreviewItem }) {
  return (
    <span
      className="bg-secondary grid shrink-0 place-items-center overflow-hidden rounded-md border"
      style={{ width: TILE_SIZE, height: TILE_SIZE }}
    >
      {item?.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image_url} alt="" className="size-full object-cover" />
      ) : (
        <ImageIcon
          className="text-muted-foreground size-5"
          aria-hidden="true"
        />
      )}
    </span>
  );
}

export function PreviewPanel({
  controller,
  spinOnMount = false,
}: {
  controller: RandomPoolController;
  spinOnMount?: boolean;
}) {
  const { draft, poolItems, files } = controller;
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(288);

  useEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setStageWidth(entry.contentRect.width),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const weighted = draft.mode === "WEIGHTED";
  const items = useMemo<PreviewItem[]>(
    () =>
      poolItems.map((item, index) => ({
        id: item.id ?? `item-${index}`,
        name: item.name ?? null,
        image_url: item.image_url ?? null,
        weight: weighted ? controller.weightOf(item.id) : 1,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [poolItems, weighted, draft.items],
  );

  const preview = usePreviewSpin(items, draft.visualization, stageWidth);
  const count = items.length;
  const handledKey = useRef(spinOnMount ? 0 : controller.testSpinKey);
  const { testSpinKey } = controller;
  const { spin } = preview;
  useEffect(() => {
    if (testSpinKey === handledKey.current) return;
    handledKey.current = testSpinKey;
    spin();
  }, [testSpinKey, spin]);
  const shown = items[preview.shownIndex];
  const result = items[preview.resultIndex];
  const resultName = count === 0 ? "ไม่มีรายการ" : result?.name || "ไม่มีชื่อ";
  const chatText = (draft.default_chat_message ?? "")
    .replace(/\{\{user\}\}/g, "NongMint")
    .replace(/\{\{item\}\}/g, result?.name ?? "")
    .slice(0, MAX_CHAT_MESSAGE_LENGTH);
  const spinSound = files.find((file) => file.key === draft.spin_sound_key);
  const resultSound = files.find(
    (file) => file.key === draft.default_result_sound_key,
  );
  const slices = wheelSlices(items.map((item) => item.weight));

  return (
    <div className="bg-card grid gap-4 rounded-xl border p-4">
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <Eye className="text-primary size-5" aria-hidden="true" />
        ตัวอย่าง
      </h2>

      <div
        ref={stageRef}
        aria-label="ตัวอย่าง Animation บน OBS"
        className="relative grid aspect-video place-items-center overflow-hidden rounded-lg border"
        style={{
          background:
            "conic-gradient(var(--card) 25%, var(--background) 0 50%, var(--card) 0 75%, var(--background) 0) 0 0 / 24px 24px",
        }}
      >
        {count === 0 && (
          <span className="text-muted-foreground text-sm italic">
            ไม่มีรายการ
          </span>
        )}
        {count > 0 && draft.visualization === "SHUFFLE" && (
          <div className="bg-secondary grid w-[42%] justify-items-center gap-1 rounded-lg border p-2 shadow-lg">
            <ItemThumb
              url={shown?.image_url}
              alt={shown?.name || "ตัวอย่างรายการ"}
              className="w-full"
            />
            <span className="max-w-full truncate text-sm font-semibold">
              {shown?.name || "ไม่มีชื่อ"}
            </span>
          </div>
        )}
        {count > 0 && draft.visualization === "SLIDE" && (
          <>
            <div
              className="absolute top-1/2 left-0 flex gap-2"
              style={{
                marginTop: -TILE_SIZE / 2,
                transform: `translateX(${preview.slideOffset}px)`,
                transition: preview.slideAnimate
                  ? `transform ${SPIN_DURATION_MS}ms ${DECELERATION}`
                  : "none",
              }}
            >
              {[...items, ...items, ...items].map((item, index) => (
                <Tile key={`${item.id}-${index}`} item={item} />
              ))}
            </div>
            <div className="bg-primary absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2" />
          </>
        )}
        {count > 0 && draft.visualization === "WHEEL" && (
          <div className="relative size-37.5">
            <span className="border-t-primary absolute -top-1.5 left-1/2 -ml-2 size-0 border-x-8 border-t-16 border-x-transparent" />
            <div
              className="size-37.5"
              style={{
                transform: `rotate(${preview.wheelDegrees}deg)`,
                transition: preview.wheelAnimate
                  ? `transform ${SPIN_DURATION_MS}ms ${DECELERATION}`
                  : "none",
              }}
            >
              <svg
                viewBox="0 0 160 160"
                width="150"
                height="150"
                aria-hidden="true"
              >
                {slices.map((path, index) => (
                  <path
                    key={index}
                    d={path}
                    style={{
                      fill:
                        index % 2 === 0 ? "var(--secondary)" : "var(--card)",
                      stroke: "var(--background)",
                      strokeWidth: 2,
                    }}
                  />
                ))}
              </svg>
            </div>
          </div>
        )}
      </div>

      <p className="text-muted-foreground text-sm">ผลที่ได้: {resultName}</p>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={preview.spinning || count === 0}
        onClick={preview.spin}
      >
        <Play />
        ลองสุ่ม
      </Button>

      <div className="grid gap-2">
        <span className="text-sm font-medium">ข้อความในแชท</span>
        {chatText ? (
          <div className="bg-background flex items-start gap-2 rounded-lg border p-3">
            <Avatar className="size-6">
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <div className="min-w-0 text-sm">
              <div className="font-semibold">Bot</div>
              <div className="break-words">{chatText}</div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm italic">
            ยังไม่ได้ตั้งข้อความ บอทจะไม่พิมพ์อะไร
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <span className="text-sm font-medium">เสียง</span>
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="text-muted-foreground">ตอนกำลังสุ่ม</span>
          {spinSound ? (
            <span className="truncate font-mono">{spinSound.name}</span>
          ) : (
            <span className="text-muted-foreground italic">ยังไม่ได้ตั้ง</span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="text-muted-foreground">ตอนของออก</span>
          {resultSound ? (
            <span className="truncate font-mono">{resultSound.name}</span>
          ) : (
            <span className="text-muted-foreground italic">ยังไม่ได้ตั้ง</span>
          )}
        </div>
      </div>
    </div>
  );
}
