import { AlertTriangle, Info, OctagonAlert } from "lucide-react";
import { Config, ConfigDraft } from "./types";

export const MAX_CONFIGS = 50;
export const MAX_POOL_ITEMS = 50;
export const MAX_ITEM_NAME_LENGTH = 32;
export const MAX_CHAT_MESSAGE_LENGTH = 500;
export const NEW_CONFIG_ID = "new";
export const MIN_WEIGHT = 0.001;
export const MAX_WEIGHT = 1_000_000;

export const CHAT_VARIABLES = [
  {
    token: "{{user}}",
    title: "ชื่อผู้แลก",
    description: "ชื่อคนดูที่แลกแต้มช่อง",
  },
  {
    token: "{{item}}",
    title: "ชื่อของที่สุ่มได้",
    description: "ถ้ารายการไม่มีชื่อ จะเป็นค่าว่าง",
  },
] as const;

export const POOL_STATE_NOTICE: Record<
  Exclude<Config["pool_state"], "READY">,
  { tone: "danger" | "warning"; title: string; description: string }
> = {
  DELETED: {
    tone: "danger",
    title: "กองสุ่มถูกลบแล้ว",
    description:
      "เจ้าของกองสุ่มลบกองสุ่มนี้ การตั้งค่าถูกปิดใช้งานให้อัตโนมัติ",
  },
  EMPTY: {
    tone: "warning",
    title: "กองสุ่มไม่มีรายการ",
    description: "เพิ่มอย่างน้อย 1 รายการ ถึงจะสุ่มและเปิดใช้การตั้งค่านี้ได้",
  },
  HIDDEN: {
    tone: "warning",
    title: "กองสุ่มถูกซ่อน",
    description:
      "เจ้าของเปลี่ยนกองสุ่มเป็นส่วนตัว การตั้งค่ายังใช้ต่อได้จนกว่าคุณจะเปลี่ยน",
  },
};

export function emptyConfigDraft(
  name: string,
  twitchBotId: string | null = null,
): ConfigDraft {
  return {
    name,
    pool_id: "",
    twitch_reward_id: "",
    twitch_bot_id: twitchBotId,
    mode: "UNIFORM",
    visualization: "SHUFFLE",
    default_chat_message: "",
    spin_sound_key: null,
    default_result_sound_key: null,
    items: [],
  };
}

export function draftFromConfig(config: Config): ConfigDraft {
  return {
    name: config.name,
    pool_id: config.pool_id,
    twitch_reward_id: config.twitch_reward_id,
    twitch_bot_id: config.twitch_bot_id ?? null,
    mode: config.mode,
    visualization: config.visualization,
    default_chat_message: config.default_chat_message ?? "",
    spin_sound_key: config.spin_sound_key ?? null,
    default_result_sound_key: config.default_result_sound_key ?? null,
    items: config.items.map((setting) => ({ ...setting })),
  };
}

/** Status tones for `Alert`: border + tint, the status text color and its icon. */
export const ALERT_TONE = {
  danger: {
    box: "border-destructive/50 bg-destructive/10",
    text: "text-destructive",
    Icon: OctagonAlert,
  },
  warning: {
    box: "border-warning/50 bg-warning/10",
    text: "text-warning",
    Icon: AlertTriangle,
  },
  info: {
    box: "border-info/50 bg-info/10",
    text: "text-info",
    Icon: Info,
  },
} as const;

/** The design system focus ring: 2px `ring` with a 2px offset on every interactive element. */
export const FOCUS_RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
