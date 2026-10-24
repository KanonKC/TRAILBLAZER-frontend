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
    description: "ชื่อคนดูที่แลกแต้มช่อง",
    example: "NongMint",
  },
  {
    token: "{{item}}",
    description: "ชื่อของที่สุ่มได้ ถ้ารายการไม่มีชื่อ จะเป็นค่าว่าง",
    example: "ชานมไข่มุก",
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

export function emptyConfigDraft(name: string): ConfigDraft {
  return {
    name,
    pool_id: "",
    twitch_reward_id: "",
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
    mode: config.mode,
    visualization: config.visualization,
    default_chat_message: config.default_chat_message ?? "",
    spin_sound_key: config.spin_sound_key ?? null,
    default_result_sound_key: config.default_result_sound_key ?? null,
    items: config.items.map((setting) => ({ ...setting })),
  };
}

/** Focus styles for inputs: neutral, never the primary brand color. */
export const neutralFocus =
  "focus-visible:border-foreground/40 focus-visible:ring-foreground/20";
