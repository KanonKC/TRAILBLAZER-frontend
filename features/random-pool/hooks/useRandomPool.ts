"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { randomPoolApi } from "../api/randomPool.api";
import {
  Config,
  ConfigDraft,
  InitialData,
  ItemSetting,
  Pool,
  PoolDraft,
  PoolItem,
  Reward,
} from "../types";
import {
  MAX_CONFIGS,
  MAX_WEIGHT,
  MIN_WEIGHT,
  NEW_CONFIG_ID,
  draftFromConfig,
  emptyConfigDraft,
} from "../constants";
import { UploadedFile } from "@/services/uploadedFile.service";
import {
  ExtendedWidget,
  WidgetQuota,
  getWidgetQuota,
  listWidgets,
  updateWidgetEnabled,
} from "@/services/widget.service";
import { tbToast } from "@/utils/tbToast";

export type RandomPoolTab = "overview" | "quick-start" | "settings";
export type SettingsView = "list" | "edit";
export type UploadHandler = (
  file: File,
  kind: "image" | "audio",
  onUploaded: (key: string, url: string) => void,
) => Promise<void>;

const emptyInitialData: InitialData = {
  pools: { data: [], limit: 3 },
  configs: { data: [] },
};

function errorMessage(error: unknown) {
  return isAxiosError(error)
    ? error.response?.data?.message || error.message
    : error instanceof Error
      ? error.message
      : "เกิดข้อผิดพลาด กรุณาลองใหม่";
}

function toPoolItem(item: PoolItem): PoolItem {
  return {
    id: item.id,
    name: item.name ?? null,
    image_key: item.image_key ?? null,
    image_url: item.image_url ?? null,
  };
}

function toPoolDraft(pool: Pool, items: PoolItem[]): PoolDraft {
  return {
    name: pool.name,
    visibility: pool.visibility,
    cover_key: pool.cover_key ?? null,
    cover_url: pool.cover_url ?? null,
    items,
  };
}

export interface RandomPoolStartOptions {
  tab?: RandomPoolTab;
  /** A config id, or `new` to open the create form, shown in the editor. */
  configId?: string;
}

export function useRandomPool(
  initial: InitialData | null,
  start: RandomPoolStartOptions = {},
) {
  const [data, setData] = useState<InitialData>(initial ?? emptyInitialData);
  const initialConfigs = initial?.configs.data ?? [];
  const requestedConfig = initialConfigs.find(
    (config) => config.id === start.configId,
  );
  const openNew =
    start.configId === NEW_CONFIG_ID && initialConfigs.length < MAX_CONFIGS;
  const startingConfig = requestedConfig ?? initialConfigs[0];
  const [activeTab, setActiveTab] = useState<RandomPoolTab>(
    initial ? (start.tab ?? "overview") : "overview",
  );
  const [settingsView, setSettingsView] = useState<SettingsView>(
    requestedConfig || openNew ? "edit" : "list",
  );
  const [editingId, setEditingId] = useState<string>(
    openNew ? NEW_CONFIG_ID : (startingConfig?.id ?? NEW_CONFIG_ID),
  );
  const [draft, setDraft] = useState<ConfigDraft>(() =>
    !openNew && startingConfig
      ? draftFromConfig(startingConfig)
      : emptyConfigDraft(
          openNew
            ? `การตั้งค่าใหม่ ${initialConfigs.length + 1}`
            : "Random Pool",
        ),
  );
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [testSpinKey, setTestSpinKey] = useState(0);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [quota, setQuota] = useState<WidgetQuota | null>(null);
  const [quotaVersion, setQuotaVersion] = useState(0);
  const [limitDialog, setLimitDialog] = useState<{
    open: boolean;
    widgets: ExtendedWidget[];
  }>({ open: false, widgets: [] });

  const isLoggedIn = initial !== null;
  const isNewConfig = editingId === NEW_CONFIG_ID;
  const savedConfig = data.configs.data.find(
    (config) => config.id === editingId,
  );
  const selectedPool = data.pools.data.find(
    (pool) => pool.id === draft.pool_id,
  );
  const poolItems = useMemo(() => selectedPool?.items ?? [], [selectedPool]);

  const refreshQuota = useCallback(async () => {
    try {
      setQuota(await getWidgetQuota());
    } catch {
      // The quota meter in the layout reports its own failures.
    }
    setQuotaVersion((previous) => previous + 1);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    let active = true;
    getWidgetQuota()
      .then((value) => active && setQuota(value))
      .catch(() => undefined);
    Promise.allSettled([randomPoolApi.rewards(), randomPoolApi.files()]).then(
      ([rewardsResult, filesResult]) => {
        if (!active) return;
        if (rewardsResult.status === "fulfilled")
          setRewards(rewardsResult.value);
        else
          tbToast.error({
            title: "โหลดแต้มช่องไม่สำเร็จ",
            description: errorMessage(rewardsResult.reason),
          });
        if (filesResult.status === "fulfilled") setFiles(filesResult.value);
      },
    );
    return () => {
      active = false;
    };
  }, [isLoggedIn]);

  async function run(action: () => Promise<void>, failureTitle: string) {
    setBusy(true);
    try {
      await action();
      return true;
    } catch (error) {
      tbToast.error({ title: failureTitle, description: errorMessage(error) });
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function refresh() {
    const latest = await randomPoolApi.load();
    setData(latest);
    return latest;
  }

  /* ---------- navigation between configs ---------- */

  function selectConfig(id: string, nextView: SettingsView = "edit") {
    const target = data.configs.data.find((config) => config.id === id);
    if (!target) return;
    setEditingId(id);
    setDraft(draftFromConfig(target));
    setSettingsView(nextView);
  }

  function startNewConfig() {
    if (data.configs.data.length >= MAX_CONFIGS) return;
    setEditingId(NEW_CONFIG_ID);
    setDraft(
      emptyConfigDraft(`การตั้งค่าใหม่ ${data.configs.data.length + 1}`),
    );
    setSettingsView("edit");
  }

  function backToList() {
    setSettingsView("list");
  }

  /* ---------- draft editing ---------- */

  function patchDraft(patch: Partial<ConfigDraft>) {
    setDraft((previous) => ({ ...previous, ...patch }));
  }

  function selectPool(poolId: string) {
    setDraft((previous) => ({ ...previous, pool_id: poolId, items: [] }));
  }

  function changeMode(mode: ConfigDraft["mode"]) {
    setDraft((previous) => ({
      ...previous,
      mode,
      visualization: mode === "WEIGHTED" ? "WHEEL" : "SHUFFLE",
    }));
  }

  function updateItemSetting(
    itemId: string,
    update: Partial<Omit<ItemSetting, "item_id">>,
  ) {
    setDraft((previous) => {
      const existing = previous.items.find(
        (setting) => setting.item_id === itemId,
      );
      return {
        ...previous,
        items: [
          ...previous.items.filter((setting) => setting.item_id !== itemId),
          { item_id: itemId, weight: 1, ...existing, ...update },
        ],
      };
    });
  }

  function setItemWeight(itemId: string, weight: number) {
    updateItemSetting(itemId, {
      weight: Math.min(MAX_WEIGHT, Math.max(MIN_WEIGHT, weight || MIN_WEIGHT)),
    });
  }

  function weightOf(itemId?: string) {
    return (
      draft.items.find((setting) => setting.item_id === itemId)?.weight ?? 1
    );
  }

  /* ---------- config persistence ---------- */

  const canSave =
    !busy &&
    draft.name.trim().length > 0 &&
    draft.pool_id.length > 0 &&
    draft.twitch_reward_id.length > 0;

  function saveConfig() {
    return run(async () => {
      const payload: ConfigDraft = {
        ...draft,
        name: draft.name.trim(),
        items: draft.items.filter((setting) =>
          poolItems.some((item) => item.id === setting.item_id),
        ),
      };
      const saved = await randomPoolApi.saveConfig(
        payload,
        isNewConfig ? undefined : editingId,
      );
      const latest = await refresh();
      const fresh =
        latest.configs.data.find((config) => config.id === saved.id) ?? saved;
      setEditingId(fresh.id);
      setDraft(draftFromConfig(fresh));
      tbToast.success({ title: "บันทึกการตั้งค่าแล้ว" });
      void refreshQuota();
    }, "บันทึกการตั้งค่าไม่สำเร็จ");
  }

  function deleteConfig() {
    return run(async () => {
      if (isNewConfig) {
        setSettingsView("list");
        return;
      }
      await randomPoolApi.deleteConfig(editingId);
      const latest = await refresh();
      const next = latest.configs.data[0];
      setEditingId(next?.id ?? NEW_CONFIG_ID);
      setDraft(next ? draftFromConfig(next) : emptyConfigDraft("Random Pool"));
      setSettingsView("list");
      tbToast.success({ title: "ลบการตั้งค่าแล้ว" });
      void refreshQuota();
    }, "ลบการตั้งค่าไม่สำเร็จ");
  }

  async function toggleConfig(target: Config, enabled: boolean) {
    setTogglingId(target.id);
    try {
      await randomPoolApi.enable(target.id, enabled);
      await refresh();
      tbToast.success({
        title: enabled ? "เปิดใช้งานการตั้งค่าแล้ว" : "ปิดใช้งานการตั้งค่าแล้ว",
      });
      void refreshQuota();
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 402) {
        try {
          const response = await listWidgets({ enabled: true });
          setLimitDialog({ open: true, widgets: response.data });
        } catch {
          setLimitDialog({ open: true, widgets: [] });
        }
      } else {
        tbToast.error({
          title: "อัปเดตสถานะไม่สำเร็จ",
          description: errorMessage(error),
        });
      }
    } finally {
      setTogglingId(null);
    }
  }

  async function disableOtherWidget(widgetId: string) {
    try {
      await updateWidgetEnabled(widgetId, false);
      setLimitDialog((previous) => ({
        ...previous,
        widgets: previous.widgets.filter((widget) => widget.id !== widgetId),
      }));
      await refresh();
      void refreshQuota();
    } catch {
      tbToast.error({ title: "ไม่สามารถปิดวิดเจ็ตได้" });
    }
  }

  /* ---------- pools and items ---------- */

  const upload: UploadHandler = async (file, kind, onUploaded) => {
    await run(async () => {
      const uploaded = await randomPoolApi.upload(file, kind);
      setFiles((previous) => [...previous, uploaded]);
      onUploaded(uploaded.key, uploaded.url);
    }, "อัปโหลดไฟล์ไม่สำเร็จ");
  };

  function createPool(input: {
    name: string;
    cover_key: string | null;
    cover_url: string | null;
  }) {
    return run(async () => {
      const saved = await randomPoolApi.savePool({
        name: input.name.trim(),
        visibility: "PRIVATE",
        cover_key: input.cover_key,
        cover_url: input.cover_url,
        items: [],
      });
      await refresh();
      setDraft((previous) => ({ ...previous, pool_id: saved.id, items: [] }));
      tbToast.success({ title: "สร้างกองสุ่มแล้ว" });
    }, "สร้างกองสุ่มไม่สำเร็จ");
  }

  function deletePool(target: Pool) {
    return run(async () => {
      await randomPoolApi.deletePool(target.id);
      await refresh();
      setDraft((previous) =>
        previous.pool_id === target.id
          ? { ...previous, pool_id: "", items: [] }
          : previous,
      );
      tbToast.success({ title: "ลบกองสุ่มแล้ว" });
      void refreshQuota();
    }, "ลบกองสุ่มไม่สำเร็จ");
  }

  /** Writes an item into the real pool; `index === null` appends a new one. */
  function saveItem(
    index: number | null,
    item: PoolItem,
    setting: Partial<Omit<ItemSetting, "item_id">>,
  ) {
    return run(async () => {
      if (!selectedPool) return;
      const items = selectedPool.items.map(toPoolItem);
      const normalized: PoolItem = {
        ...toPoolItem(item),
        name: item.name?.trim() || null,
      };
      let targetIndex: number;
      if (index === null) {
        items.push(normalized);
        targetIndex = items.length - 1;
      } else {
        items[index] = { ...items[index], ...normalized };
        targetIndex = index;
      }
      const saved = await randomPoolApi.savePool(
        toPoolDraft(selectedPool, items),
        selectedPool.id,
      );
      await refresh();
      const savedItem = saved.items[targetIndex];
      if (savedItem?.id) updateItemSetting(savedItem.id, setting);
      tbToast.success({ title: "บันทึกรายการแล้ว" });
    }, "บันทึกรายการไม่สำเร็จ");
  }

  function removeItem(itemId: string) {
    return run(async () => {
      if (!selectedPool) return;
      const items = selectedPool.items
        .filter((item) => item.id !== itemId)
        .map(toPoolItem);
      await randomPoolApi.savePool(
        toPoolDraft(selectedPool, items),
        selectedPool.id,
      );
      await refresh();
      setDraft((previous) => ({
        ...previous,
        items: previous.items.filter((setting) => setting.item_id !== itemId),
      }));
      tbToast.success({ title: "ลบรายการแล้ว" });
    }, "ลบรายการไม่สำเร็จ");
  }

  return {
    data,
    isLoggedIn,
    activeTab,
    setActiveTab,
    settingsView,
    editingId,
    isNewConfig,
    draft,
    patchDraft,
    savedConfig,
    selectedPool,
    poolItems,
    rewards,
    files,
    busy,
    togglingId,
    testSpinKey,
    requestTestSpin: () => setTestSpinKey((previous) => previous + 1),
    quota,
    quotaVersion,
    limitDialog,
    setLimitDialog,
    canSave,
    selectConfig,
    startNewConfig,
    backToList,
    selectPool,
    changeMode,
    updateItemSetting,
    setItemWeight,
    weightOf,
    saveConfig,
    deleteConfig,
    reload: refresh,
    toggleConfig,
    disableOtherWidget,
    upload,
    createPool,
    deletePool,
    saveItem,
    removeItem,
  };
}

export type RandomPoolController = ReturnType<typeof useRandomPool>;
