import { apiClient } from "@/lib/api-client";
import { RandomDBDKillerConfig, DBDKillerMaster } from "../types";

export const getRandomDBDKillerConfig = async (): Promise<RandomDBDKillerConfig> => {
    const response = await apiClient.get<RandomDBDKillerConfig>("/api/v1/random-dbd-killer");
    return response.data;
};

export const enableRandomDBDKiller = async (twitch_reward_id: string): Promise<RandomDBDKillerConfig> => {
    const response = await apiClient.post<RandomDBDKillerConfig>("/api/v1/random-dbd-killer", {
        twitch_reward_id,
    });
    return response.data;
};

export const updateRandomDBDKillerConfig = async (data: { twitch_reward_id?: string; killer_pool?: string[] }): Promise<RandomDBDKillerConfig> => {
    const response = await apiClient.put<RandomDBDKillerConfig>("/api/v1/random-dbd-killer", data);
    return response.data;
};

export const testRandomDBDKiller = async (eventData: any): Promise<void> => {
    await apiClient.post("/webhook/v1/twitch/event-sub/channel-redemption-add", eventData);
};

export const getDBDKillerMasterList = async (): Promise<DBDKillerMaster[]> => {
    const response = await apiClient.get<{ data: DBDKillerMaster[] }>("/api/v1/dbd-killer-master");
    return response.data.data;
};

export const getRandomDBDKillerEventUrl = (userId: string, key?: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const url = new URL(`${baseUrl}/api/v1/events/random-dbd-killer/${userId}`);
    if (key) {
        url.searchParams.append("key", key);
    }
    return url.toString();
};
