import { apiClient } from "@/lib/api-client";
import {
  UploadedFile,
  getUploadedFiles,
} from "@/services/uploadedFile.service";
import {
  Config,
  ConfigDraft,
  InitialData,
  Pool,
  PoolDraft,
  Reward,
} from "../types";
const base = "/api/v1/random-pool";
export const randomPoolApi = {
  async load(): Promise<InitialData> {
    const [pools, configs] = await Promise.all([
      apiClient.get<InitialData["pools"]>(`${base}/pools`),
      apiClient.get<InitialData["configs"]>(`${base}/configs`),
    ]);
    return { pools: pools.data, configs: configs.data };
  },
  async savePool(data: PoolDraft, id?: string) {
    return (
      await apiClient.request<Pool>({
        method: id ? "PUT" : "POST",
        url: `${base}/pools${id ? `/${id}` : ""}`,
        data,
      })
    ).data;
  },
  async deletePool(id: string) {
    await apiClient.delete(`${base}/pools/${id}`);
  },
  async saveConfig(data: ConfigDraft, id?: string) {
    return (
      await apiClient.request<Config>({
        method: id ? "PUT" : "POST",
        url: `${base}/configs${id ? `/${id}` : ""}`,
        data,
      })
    ).data;
  },
  async deleteConfig(id: string) {
    await apiClient.delete(`${base}/configs/${id}`);
  },
  async enable(id: string, enabled: boolean) {
    return (
      await apiClient.put<Config>(`${base}/configs/${id}/enabled`, { enabled })
    ).data;
  },
  async rewards() {
    return (
      await apiClient.get<{ data: Reward[] }>("/api/v1/twitch/channel-rewards")
    ).data.data;
  },
  async files() {
    return (await getUploadedFiles({ limit: 100, page: 1 })).data;
  },
  async upload(file: File, kind: "image" | "audio") {
    if (file.size > 2 * 1024 * 1024)
      throw new Error("ไฟล์ต้องมีขนาดไม่เกิน 2 MB");
    const allowed =
      kind === "image"
        ? ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif"]
        : [
            "audio/mpeg",
            "audio/mp3",
            "audio/ogg",
            "application/ogg",
            "audio/wav",
            "audio/x-wav",
            "audio/wave",
          ];
    if (!allowed.includes(file.type)) throw new Error("ประเภทไฟล์ไม่รองรับ");
    if (kind === "audio")
      await new Promise<void>((resolve, reject) => {
        const audio = new Audio();
        const url = URL.createObjectURL(file);
        const timer = setTimeout(
          () => finish(new Error("อ่านไฟล์เสียงไม่ได้")),
          10000,
        );
        const finish = (error?: Error) => {
          clearTimeout(timer);
          URL.revokeObjectURL(url);
          audio.src = "";
          if (error) reject(error);
          else resolve();
        };
        audio.onloadedmetadata = () =>
          finish(
            !Number.isFinite(audio.duration) || audio.duration > 15
              ? new Error("เสียงต้องยาวไม่เกิน 15 วินาที")
              : undefined,
          );
        audio.onerror = () => finish(new Error("อ่านไฟล์เสียงไม่ได้"));
        audio.src = url;
      });
    const upload = (
      await apiClient.post<{ token: string; url: string }>(`${base}/uploads`, {
        name: file.name,
        size: file.size,
        type: file.type,
        kind,
      })
    ).data;
    // Presigned object storage requests intentionally bypass the application API client.
    const response = await fetch(upload.url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!response.ok) throw new Error("อัปโหลดไฟล์ไม่สำเร็จ กรุณาลองใหม่");
    return (
      await apiClient.post<UploadedFile>(
        `${base}/uploads/${upload.token}/complete`,
      )
    ).data;
  },
};
export const overlayPath = (config: Config) =>
  `/overlays/random-pool/${config.id}?key=${encodeURIComponent(config.widget.overlay_key)}`;
