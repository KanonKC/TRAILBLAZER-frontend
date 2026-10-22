"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { randomPoolApi } from "../api/randomPool.api";
import {
  Config,
  ConfigDraft,
  InitialData,
  ItemSetting,
  Pool,
  PoolDraft,
  Reward,
} from "../types";
import { UploadedFile } from "@/services/uploadedFile.service";

export const emptyPool = (): PoolDraft => ({
  name: "",
  visibility: "PRIVATE",
  cover_key: null,
  items: [],
});
const emptyConfig = (): ConfigDraft => ({
  name: "",
  pool_id: "",
  twitch_reward_id: "",
  mode: "UNIFORM",
  visualization: "SHUFFLE",
  default_chat_message: "",
  items: [],
});
export function useRandomPool(
  initial: InitialData,
  configId?: string,
  poolId?: string,
  loadConfigResources = true,
) {
  const router = useRouter();
  const [data, setData] = useState(initial);
  const [config, setConfig] = useState<ConfigDraft>(
    initial.configs.data.find((config) => config.id === configId) ||
      emptyConfig,
  );
  const [pool, setPool] = useState<PoolDraft>(
    initial.pools.data.find((pool) => pool.id === poolId) || emptyPool,
  );
  const [poolDialog, setPoolDialog] = useState<{
    id?: string;
    draft: PoolDraft;
  } | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!loadConfigResources) return;
    let active = true;
    Promise.all([randomPoolApi.rewards(), randomPoolApi.files()])
      .then(([rewards, files]) => {
        if (active) {
          setRewards(rewards);
          setFiles(files);
        }
      })
      .catch((error) => {
        if (active) setError(errorMessage(error));
      });
    return () => {
      active = false;
    };
  }, [loadConfigResources]);
  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  async function refresh() {
    const latest = await randomPoolApi.load();
    setData(latest);
    return latest;
  }
  const selectedPool = data.pools.data.find(
    (pool) => pool.id === config.pool_id,
  );
  const savedConfig = data.configs.data.find(
    (config) => config.id === configId,
  );
  function selectPool(poolId: string) {
    setConfig((previous) => ({ ...previous, pool_id: poolId, items: [] }));
  }
  function updateSetting(itemId: string, update: Partial<ItemSetting>) {
    setConfig((previous) => ({
      ...previous,
      items: [
        ...previous.items.filter((setting) => setting.item_id !== itemId),
        {
          item_id: itemId,
          weight: 1,
          ...previous.items.find((setting) => setting.item_id === itemId),
          ...update,
        },
      ],
    }));
  }
  function changeMode(mode: ConfigDraft["mode"]) {
    setConfig((previous) => ({
      ...previous,
      mode,
      visualization: mode === "WEIGHTED" ? "WHEEL" : "SHUFFLE",
    }));
  }
  async function upload(
    file: File,
    kind: "image" | "audio",
    onUploaded: (key: string, url: string) => void,
  ) {
    await run(async () => {
      const uploaded = await randomPoolApi.upload(file, kind);
      setFiles((previous) => [...previous, uploaded]);
      onUploaded(uploaded.key, uploaded.url);
    });
  }
  function savePool() {
    return run(async () => {
      await randomPoolApi.savePool(pool, poolId);
      router.push("/dashboard/widgets/random-pool?tab=pools");
      router.refresh();
    });
  }
  function saveInlinePool() {
    return run(async () => {
      if (!poolDialog) return;
      const saved = await randomPoolApi.savePool(
        poolDialog.draft,
        poolDialog.id,
      );
      await refresh();
      setConfig((previous) => ({
        ...previous,
        pool_id: saved.id,
        items:
          previous.pool_id === saved.id
            ? previous.items.filter((setting) =>
                saved.items.some((item) => item.id === setting.item_id),
              )
            : [],
      }));
      setPoolDialog(null);
      setNotice("บันทึก Pool แล้ว");
    });
  }
  function deletePool(target: Pool) {
    return run(async () => {
      await randomPoolApi.deletePool(target.id);
      await refresh();
      if (poolId === target.id) {
        router.push("/dashboard/widgets/random-pool?tab=pools");
        router.refresh();
      }
      if (config.pool_id === target.id)
        setConfig((previous) => ({ ...previous, pool_id: "", items: [] }));
    });
  }
  function saveConfig() {
    return run(async () => {
      const payload = {
        ...config,
        items: config.items.filter((setting) =>
          selectedPool?.items.some((item) => item.id === setting.item_id),
        ),
      };
      await randomPoolApi.saveConfig(payload, configId);
      router.push("/dashboard/widgets/random-pool");
      router.refresh();
    });
  }
  function toggle(target: Config) {
    return run(async () => {
      await randomPoolApi.enable(target.id, !target.widget.enabled);
      await refresh();
    });
  }
  function deleteConfig(target: Config) {
    return run(async () => {
      await randomPoolApi.deleteConfig(target.id);
      await refresh();
    });
  }
  return {
    data,
    config,
    setConfig,
    pool,
    setPool,
    poolDialog,
    setPoolDialog,
    rewards,
    files,
    busy,
    error,
    notice,
    selectedPool,
    savedConfig,
    selectPool,
    updateSetting,
    changeMode,
    upload,
    savePool,
    saveInlinePool,
    deletePool,
    saveConfig,
    toggle,
    deleteConfig,
  };
}
function errorMessage(error: unknown) {
  return isAxiosError(error)
    ? error.response?.data?.message || error.message
    : error instanceof Error
      ? error.message
      : "เกิดข้อผิดพลาด กรุณาลองใหม่";
}
