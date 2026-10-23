"use client";

import { Switch } from "@/components/ui/switch";
import { Config } from "../types";
import { RandomPoolController } from "../hooks/useRandomPool";

/** Why a config cannot be switched on right now, or null when it can. */
export function enableBlockedReason(
  config: Config | undefined,
  controller: RandomPoolController,
) {
  if (!config) return "บันทึกการตั้งค่าก่อนจึงเปิดใช้งานได้";
  if (config.widget.enabled) return null;
  if (config.pool_state === "EMPTY") return "กองสุ่มไม่มีรายการ";
  if (config.pool_state === "DELETED") return "กองสุ่มถูกลบ";
  if (config.pool_state === "HIDDEN") return "กองสุ่มถูกซ่อน";
  const quota = controller.quota;
  if (quota && quota.remaining_quota <= 0)
    return `เปิดใช้งานไม่ได้ เพราะพอยท์ครบ ${quota.used_quota} / ${quota.total_quota}`;
  return null;
}

export function ConfigEnableSwitch({
  config,
  controller,
}: {
  config: Config | undefined;
  controller: RandomPoolController;
}) {
  const reason = enableBlockedReason(config, controller);
  return (
    <Switch
      aria-label={config ? `เปิดใช้งาน ${config.name}` : "เปิดใช้งานการตั้งค่า"}
      checked={config?.widget.enabled ?? false}
      disabled={!config || !!reason || controller.togglingId === config.id}
      onCheckedChange={(checked) =>
        config && void controller.toggleConfig(config, checked)
      }
    />
  );
}
