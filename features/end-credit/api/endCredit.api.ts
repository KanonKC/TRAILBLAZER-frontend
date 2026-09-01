import { apiClient } from "@/lib/api-client";
import { EndCreditConfig, EndCreditViewerRecord } from "../types";

export const getEndCreditConfig = async (): Promise<EndCreditConfig> => {
    const response = await apiClient.get<EndCreditConfig>("/api/v1/end-credit");
    return response.data;
};

export const enableEndCredit = async (twitchId: string, ownerId: string): Promise<EndCreditConfig> => {
    const response = await apiClient.post<EndCreditConfig>("/api/v1/end-credit", {
        twitch_id: twitchId,
        owner_id: ownerId,
    });
    return response.data;
};

export const updateEndCreditConfig = async (data: Partial<EndCreditConfig>): Promise<EndCreditConfig> => {
    const response = await apiClient.put<EndCreditConfig>("/api/v1/end-credit", data);
    return response.data;
};

export const refreshEndCreditOverlayKey = async (): Promise<EndCreditConfig> => {
    const response = await apiClient.post<EndCreditConfig>("/api/v1/end-credit/refresh-key");
    return response.data;
};

export const testEndCredit = async (): Promise<void> => {
    await apiClient.post("/api/v1/end-credit/test");
};

export const getEndCreditRecordsUrl = (userId: string, key?: string): string => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const url = `${BASE_URL}/api/v1/end-credit/${encodeURIComponent(userId)}/records`;
    if (key) {
        return `${url}?key=${encodeURIComponent(key)}`;
    }
    return url;
};

export const getEndCreditEventUrl = (userId: string, key?: string): string => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const url = `${BASE_URL}/api/v1/events/end-credit/${encodeURIComponent(userId)}`;
    if (key) {
        return `${url}?key=${encodeURIComponent(key)}`;
    }
    return url;
};

export interface EndCreditOverlayData {
    records: EndCreditViewerRecord[];
    is_show_viewer_avatars: boolean;
    followers_header: string | null;
    subscribes_header: string | null;
    raids_header: string | null;
    bits_header: string | null;
    viewers_header: string | null;
    scroll_speed: number;
    is_show_sub_months: boolean;
    is_show_raid_count: boolean;
    is_show_bits_amount: boolean;
}

export const fetchEndCreditOverlayData = async (userId: string, key?: string): Promise<EndCreditOverlayData> => {
    const response = await fetch(getEndCreditRecordsUrl(userId, key));
    if (!response.ok) {
        throw new Error(`Failed to fetch end credit records: ${response.status}`);
    }
    return response.json();
};
