import { apiClient } from "@/lib/api-client";

export interface ClipShoutoutConfig {
    id: string;
    twitch_id: string;
    owner_id: string;
    reply_message: string | null;
    enabled: boolean;
    overlay_key: string;
    twitch_bot_id?: string | null;
    enabled_clip?: boolean;
    enabled_highlight_only?: boolean;
}

export const getClipShoutoutConfig = async (): Promise<ClipShoutoutConfig | null> => {
    try {
        const response = await apiClient.get<ClipShoutoutConfig>("/api/v1/clip-shoutout");
        return response.data;
    } catch (error) {
        return null;
    }
};

export const enableClipShoutout = async (twitchId: string, ownerId: string): Promise<ClipShoutoutConfig | null> => {
    try {
        const response = await apiClient.post<ClipShoutoutConfig>("/api/v1/clip-shoutout", {
            twitch_id: twitchId,
            owner_id: ownerId,
        });
        return response.data;
    } catch (error) {
        return null;
    }
};

export const updateClipShoutoutConfig = async (data: Partial<ClipShoutoutConfig>): Promise<ClipShoutoutConfig | null> => {
    try {
        const response = await apiClient.put<ClipShoutoutConfig>("/api/v1/clip-shoutout", data);
        return response.data;
    } catch (error) {
        return null;
    }
};

export const deleteClipShoutoutConfig = async (): Promise<boolean> => {
    try {
        await apiClient.delete("/api/v1/clip-shoutout");
        return true;
    } catch (error) {
        return false;
    }
};

export const testClipShoutout = async (eventData: any): Promise<void> => {
    await apiClient.post("/webhook/v1/twitch/event-sub/channel-chat-notification", eventData);
};

export const refreshClipShoutoutOverlayKey = async (): Promise<ClipShoutoutConfig | null> => {
    try {
        const response = await apiClient.post<ClipShoutoutConfig>("/api/v1/clip-shoutout/refresh-key");
        return response.data;
    } catch (error) {
        return null;
    }
};

export const getClipShoutoutEventUrl = (userId: string, key?: string): string => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const url = `${BASE_URL}/api/v1/events/clip-shoutout/${userId}`;
    if (key) {
        return `${url}?key=${key}`;
    }
    return url;
};
