import { apiClient } from "@/lib/api-client";

export interface DropImageConfig {
    id: string;
    enabled: boolean;
    enabled_moderation: boolean;
    display_duration: number;
    twitch_reward_id: string | null;
    twitch_bot_id: string | null;
    invalid_message: string | null;
    not_image_message: string | null;
    contain_mature_message: string | null;
    widget: {
        id: string;
        overlay_key: string;
        enabled: boolean;
    };
}

export const getDropImageConfig = async (): Promise<DropImageConfig | null> => {
    try {
        const response = await apiClient.get<DropImageConfig>("/api/v1/drop-image");
        return response.data;
    } catch (error) {
        return null;
    }
};

export const enableDropImage = async (enabled: boolean): Promise<DropImageConfig | null> => {
    try {
        const response = await apiClient.post<DropImageConfig>("/api/v1/drop-image", {
            enabled,
        });
        return response.data;
    } catch (error) {
        return null;
    }
};

export const updateDropImageConfig = async (data: Partial<DropImageConfig>): Promise<DropImageConfig | null> => {
    try {
        const response = await apiClient.put<DropImageConfig>("/api/v1/drop-image", data);
        return response.data;
    } catch (error) {
        return null;
    }
};

export const refreshDropImageKey = async (): Promise<DropImageConfig | null> => {
    try {
        const response = await apiClient.post<DropImageConfig>("/api/v1/drop-image/refresh-key");
        return response.data;
    } catch (error) {
        console.error("Failed to refresh drop image key", error);
        return null;
    }
};

export const getDropImageEventUrl = (userId: string, key?: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const url = new URL(`${baseUrl}/api/v1/events/drop-image/${userId}`);
    if (key) {
        url.searchParams.append("key", key);
    }
    return url.toString();
};

export const testDropImage = async (eventData: any): Promise<void> => {
    await apiClient.post("/webhook/v1/twitch/event-sub/channel-chat-message", eventData);
};
