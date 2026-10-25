"use client";

import {
  ChevronRight,
  Layers,
  Package,
  Plus,
  TriangleAlert,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RandomPoolController } from "../hooks/useRandomPool";
import { FOCUS_RING, MAX_CONFIGS, POOL_STATE_NOTICE } from "../constants";
import SubLabel from "@/components/SubLabel";
import { Config } from "../types";
import { WidgetStatusSwitch } from "@/components/widget/WidgetStatusSwitch";
import { enableBlockedReason } from "../enableBlockedReason";
import { ItemThumb } from "./ItemThumb";
import { RewardLabel } from "./RewardLabel";

function RowTag({
  tone,
  children,
}: {
  tone: "warning" | "danger";
  children: string;
}) {
  return (
    <span
      className={cn(
        "mt-1 inline-flex h-6 items-center gap-1 rounded-full border px-2 text-sm font-medium",
        tone === "danger"
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : "border-warning/40 bg-warning/10 text-warning",
      )}
    >
      <TriangleAlert className="size-3.5" aria-hidden="true" />
      {children}
    </span>
  );
}

function ConfigRow({
  config,
  controller,
}: {
  config: Config;
  controller: RandomPoolController;
}) {
  const reward = controller.rewards.find(
    (candidate) => candidate.id === config.twitch_reward_id,
  );
  const hasPool = config.pool_state !== "DELETED" && !!config.pool;
  const enabled = config.widget.enabled;
  const thumb = config.pool?.cover_url ?? config.pool?.items[0]?.image_url;
  const poolProblem =
    config.pool_state !== "READY" ? POOL_STATE_NOTICE[config.pool_state] : null;

  return (
    <div
      className={cn(
        "bg-card hover:bg-secondary flex flex-wrap items-center gap-4 rounded-lg border p-4",
        !enabled && "opacity-90",
      )}
    >
      <button
        type="button"
        aria-label={`แก้ไข ${config.name}`}
        onClick={() => controller.selectConfig(config.id)}
        className={cn("flex min-w-0 flex-1 items-center gap-4 rounded-md text-left", FOCUS_RING)}
      >
        <ItemThumb
          url={thumb}
          alt=""
          className="size-16 shrink-0 border"
          iconClassName="size-6"
        />
        <span className="grid min-w-0 justify-items-start gap-0.5">
          <span
            className={cn(
              "max-w-full truncate text-base font-semibold",
              !enabled && "opacity-70",
            )}
          >
            {config.name}
          </span>
          <span className="text-muted-foreground flex max-w-full items-center gap-2 text-sm">
            <span className="shrink-0">แต้มช่อง:</span>
            {reward ? (
              <RewardLabel reward={reward} showCost className="text-foreground" />
            ) : (
              <span>ยังไม่ได้เลือก</span>
            )}
          </span>
          <span className="text-muted-foreground flex max-w-full items-center gap-2 text-sm">
            <Package className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">
              กองสุ่ม:{" "}
              {hasPool
                ? `${config.pool.name} · ${config.pool.items.length} รายการ`
                : "ยังไม่ได้เลือก"}
            </span>
          </span>
          {poolProblem && (
            <RowTag tone={poolProblem.tone}>{poolProblem.title}</RowTag>
          )}
        </span>
        <ChevronRight className="text-muted-foreground ml-auto size-5 shrink-0" />
      </button>
      <div className="flex shrink-0 items-center gap-3 max-sm:w-full max-sm:justify-end">
        {enabled && (
          <span className="inline-flex items-center gap-1 rounded-full bg-supernova/10 px-2 py-0.5 text-sm font-medium text-supernova">
            <Zap className="size-3.5" />1 พอยท์
          </span>
        )}
        <span
          className={cn(
            "min-w-13 text-right text-sm font-medium",
            enabled ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {enabled ? "เปิดอยู่" : "ปิดอยู่"}
        </span>
        <WidgetStatusSwitch
          widgetId={config.widget.id}
          isEnabled={config.widget.enabled}
          disabled={!!enableBlockedReason(config, controller.quota)}
          ariaLabel={`เปิดใช้งาน ${config.name}`}
          onSuccess={() => void controller.afterStatusChange()}
        />
      </div>
    </div>
  );
}

export function ConfigList({
  controller,
}: {
  controller: RandomPoolController;
}) {
  const configs = controller.data.configs.data;
  const full = configs.length >= MAX_CONFIGS;
  const quota = controller.quota;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <Layers className="size-5 text-violet" />
            การตั้งค่าทั้งหมด
          </span>
          <span className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm font-normal tabular-nums">
              สร้างแล้ว {configs.length} / {MAX_CONFIGS}
            </span>
            <Button
              type="button"
              size="sm"
              disabled={full}
              onClick={controller.startNewConfig}
            >
              <Plus />
              สร้างการตั้งค่าใหม่
            </Button>
          </span>
        </CardTitle>
        <CardDescription>
          แต่ละการตั้งค่าผูกกับแต้มช่อง 1 อัน และกองสุ่ม 1 กอง
          กดที่แถวเพื่อเข้าไปแก้ไข
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {configs.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm">
            ไม่พบข้อมูล
          </p>
        ) : (
          configs.map((config) => (
            <ConfigRow
              key={config.id}
              config={config}
              controller={controller}
            />
          ))
        )}
        <SubLabel>
          สร้างได้สูงสุด {MAX_CONFIGS} การตั้งค่า แต่เปิดใช้งานพร้อมกันได้ตาม
          พอยท์วิดเจ็ต ที่เหลือ เปิด 1 การตั้งค่าใช้ 1 พอยท์
          {quota ? ` (ใช้อยู่ ${quota.used_quota} / ${quota.total_quota})` : ""}
        </SubLabel>
      </CardContent>
    </Card>
  );
}
