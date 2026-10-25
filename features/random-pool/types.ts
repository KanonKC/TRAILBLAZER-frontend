export interface PoolItem {
  id?: string;
  name?: string | null;
  image_key?: string | null;
  image_url?: string | null;
}
export interface Pool {
  id: string;
  name: string;
  cover_key?: string | null;
  cover_url?: string | null;
  visibility: "PRIVATE";
  items: PoolItem[];
  _count: { configs: number };
}
export interface ItemSetting {
  item_id: string;
  weight: number;
  chat_message?: string | null;
  result_sound_key?: string | null;
}
export interface Config {
  id: string;
  name: string;
  pool_id: string;
  pool: Pool;
  pool_state: "READY" | "DELETED" | "EMPTY" | "HIDDEN";
  twitch_reward_id: string;
  /** Account that announces the result in chat: the streamer's own Twitch id, or null for the default bot. */
  twitch_bot_id?: string | null;
  mode: "UNIFORM" | "WEIGHTED";
  visualization: "SHUFFLE" | "SLIDE" | "WHEEL";
  default_chat_message?: string | null;
  spin_sound_key?: string | null;
  default_result_sound_key?: string | null;
  items: ItemSetting[];
  widget: { id: string; enabled: boolean; overlay_key: string };
}
export type ConfigDraft = Omit<Config, "id" | "pool" | "pool_state" | "widget">;
export type PoolDraft = Pick<
  Pool,
  "name" | "cover_key" | "visibility" | "items" | "cover_url"
>;
export interface InitialData {
  pools: { data: Pool[]; limit: number };
  configs: { data: Config[] };
}
export interface RewardImage {
  url_1x: string;
  url_2x?: string;
  url_4x?: string;
}
export interface Reward {
  id: string;
  title: string;
  cost: number;
  background_color?: string;
  image?: RewardImage | null;
  default_image?: RewardImage | null;
}
export interface SpinItem {
  id: string;
  name: string | null;
  image_url: string | null;
  weight?: number;
}
export interface SpinEvent {
  jobId: string;
  item: SpinItem;
  pool: SpinItem[];
  visualization: Config["visualization"];
  spin_sound_url: string | null;
  result_sound_url: string | null;
}
