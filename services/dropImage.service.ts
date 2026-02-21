import { apiClient } from "@/lib/api-client";

export interface DropImageConfig {
    id: string;
    enabled: boolean;
    widget: {
        id: string;
        overlay_key: string;
        enabled: boolean;
    };
    twitch_reward_id: string | null;
    display_duration: number;
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

export const getDropImageEventUrl = (userId: string, key?: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const url = new URL(`${baseUrl}/api/v1/drop-image/sse/${userId}`);
    if (key) {
        url.searchParams.append("key", key);
    }
    return url.toString();
};

export const testDropImage = async (eventData: any): Promise<void> => {
    await apiClient.post("/webhook/v1/twitch/event-sub/channel-redemption-add", eventData);
};
