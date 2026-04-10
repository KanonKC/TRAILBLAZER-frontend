import { apiClient } from "@/lib/api-client";
import { DropImageConfig } from "../types";

export const getDropImageConfig = async (): Promise<DropImageConfig> => {
    const response = await apiClient.get<DropImageConfig>("/api/v1/drop-image");
    return response.data;
};

export const enableDropImage = async (enabled: boolean): Promise<DropImageConfig> => {
    const response = await apiClient.post<DropImageConfig>("/api/v1/drop-image", {
        enabled,
    });
    return response.data;
};

export const updateDropImageConfig = async (data: Partial<DropImageConfig>): Promise<DropImageConfig> => {
    const response = await apiClient.put<DropImageConfig>("/api/v1/drop-image", data);
    return response.data;
};

export const refreshDropImageKey = async (): Promise<DropImageConfig> => {
    const response = await apiClient.post<DropImageConfig>("/api/v1/drop-image/refresh-key");
    return response.data;
};

export const testDropImage = async (eventData: any): Promise<void> => {
    await apiClient.post("/webhook/v1/twitch/event-sub/channel-chat-message", eventData);
};

export const getDropImageEventUrl = (userId: string, key?: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const url = new URL(`${baseUrl}/api/v1/events/drop-image/${userId}`);
    if (key) {
        url.searchParams.append("key", key);
    }
    return url.toString();
};
