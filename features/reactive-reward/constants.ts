import { AudioLines, Film, ImageIcon } from "lucide-react";
import type { ReactionMediaType, ReactionPosition } from "./types";

export const WIDGET_SLUG = "reactive-reward";
export const MAX_REACTIONS = 50;
/** Mirrors the backend price: the first point covers this many active Reactions, each further point this many more. */
export const POINT_TIER_FIRST = 10;
export const POINT_TIER_STEP = 5;

export const MIN_DISPLAY_SECONDS = 1;
export const MAX_DISPLAY_SECONDS = 30;
export const DEFAULT_DISPLAY_MS = 5000;
export const DEFAULT_VOLUME = 80;
export const DEFAULT_SIZE_PERCENT = 50;
export const MIN_SIZE_PERCENT = 10;
export const MAX_SIZE_PERCENT = 100;

export const MEDIA_TYPE_LABELS: Record<ReactionMediaType, string> = {
    IMAGE: "รูปภาพ",
    AUDIO: "เสียง",
    VIDEO: "วิดีโอ",
};

export const MEDIA_TYPE_ICONS: Record<ReactionMediaType, typeof ImageIcon> = {
    IMAGE: ImageIcon,
    AUDIO: AudioLines,
    VIDEO: Film,
};

export const MEDIA_TYPE_HINTS: Record<ReactionMediaType, string> = {
    IMAGE: "แสดงรูป และเล่นเสียงคู่กันได้",
    AUDIO: "เล่นเสียงอย่างเดียว ไม่แสดงอะไรบนจอ",
    VIDEO: "เล่นวิดีโอพร้อมเสียงในตัว",
};

/** Row by row, the way the 3x3 picker lays them out. */
export const POSITIONS: { value: ReactionPosition; label: string }[] = [
    { value: "TOP_LEFT", label: "บนซ้าย" },
    { value: "TOP_CENTER", label: "บนกลาง" },
    { value: "TOP_RIGHT", label: "บนขวา" },
    { value: "MIDDLE_LEFT", label: "กลางซ้าย" },
    { value: "CENTER", label: "กลางจอ" },
    { value: "MIDDLE_RIGHT", label: "กลางขวา" },
    { value: "BOTTOM_LEFT", label: "ล่างซ้าย" },
    { value: "BOTTOM_CENTER", label: "ล่างกลาง" },
    { value: "BOTTOM_RIGHT", label: "ล่างขวา" },
];

/** Flex alignment of each anchor point inside the overlay. */
export const POSITION_CLASSES: Record<ReactionPosition, string> = {
    TOP_LEFT: "items-start justify-start",
    TOP_CENTER: "items-start justify-center",
    TOP_RIGHT: "items-start justify-end",
    MIDDLE_LEFT: "items-center justify-start",
    CENTER: "items-center justify-center",
    MIDDLE_RIGHT: "items-center justify-end",
    BOTTOM_LEFT: "items-end justify-start",
    BOTTOM_CENTER: "items-end justify-center",
    BOTTOM_RIGHT: "items-end justify-end",
};
