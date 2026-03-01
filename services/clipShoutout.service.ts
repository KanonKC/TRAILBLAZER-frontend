import { apiClient } from "@/lib/api-client";

export interface ClipShoutoutConfig {
    id: string;
    twitch_id: string;
    owner_id: string;
    reply_message: string | null;
    enabled: boolean;
    twitch_bot_id?: string | null;
    enabled_clip?: boolean;
    enabled_highlight_only?: boolean;
    widget: {
        id: string;
        overlay_key: string;
    }
}

export const getClipShoutoutConfig = async (): Promise<ClipShoutoutConfig> => {
    const response = await apiClient.get<ClipShoutoutConfig>("/api/v1/clip-shoutout");
    return response.data;
};

export const enableClipShoutout = async (twitchId: string, ownerId: string): Promise<ClipShoutoutConfig> => {
    const response = await apiClient.post<ClipShoutoutConfig>("/api/v1/clip-shoutout", {
        twitch_id: twitchId,
        owner_id: ownerId,
    });
    return response.data;
};

export const updateClipShoutoutConfig = async (data: Partial<ClipShoutoutConfig>): Promise<ClipShoutoutConfig> => {
    const response = await apiClient.put<ClipShoutoutConfig>("/api/v1/clip-shoutout", data);
    return response.data;
};



export const testClipShoutout = async (eventData: any): Promise<void> => {
    await apiClient.post("/webhook/v1/twitch/event-sub/channel-chat-notification", eventData);
};

export const refreshClipShoutoutOverlayKey = async (): Promise<ClipShoutoutConfig> => {
    const response = await apiClient.post<ClipShoutoutConfig>("/api/v1/clip-shoutout/refresh-key");
    return response.data;
};

export const getClipShoutoutEventUrl = (userId: string, key?: string): string => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const url = `${BASE_URL}/api/v1/events/clip-shoutout/${userId}`;
    if (key) {
        return `${url}?key=${key}`;
    }
    return url;
};
