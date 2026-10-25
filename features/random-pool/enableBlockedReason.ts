import type { WidgetQuota } from "@/services/widget.service";
import type { Config } from "./types";

/** Why a config cannot be switched on right now, or null when it can. */
export function enableBlockedReason(
  config: Config | undefined,
  quota: WidgetQuota | null,
) {
  if (!config) return "บันทึกการตั้งค่าก่อนจึงเปิดใช้งานได้";
  if (config.widget.enabled) return null;
  if (config.pool_state === "EMPTY") return "กองสุ่มไม่มีรายการ";
  if (config.pool_state === "DELETED") return "กองสุ่มถูกลบ";
  if (config.pool_state === "HIDDEN") return "กองสุ่มถูกซ่อน";
  if (quota && quota.remaining_quota <= 0)
    return `เปิดใช้งานไม่ได้ เพราะพอยท์ครบ ${quota.used_quota} / ${quota.total_quota}`;
  return null;
}
