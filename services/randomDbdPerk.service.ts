import { apiClient } from "@/lib/api-client";

export interface RandomDbdPerkClass {
    id: string;
    type: "survivor" | "killer";
    enabled: boolean;
    twitch_reward_id: string | null;
    maximum_random_size: number;
}

export interface RandomDbdPerkConfig {
    id: string;
    enabled: boolean;
    widget: {
        id: string;
        overlay_key: string;
        enabled: boolean;
    };
    classes: RandomDbdPerkClass[];
    totalKillerPerks: number;
    totalSurvivorPerks: number;
}

export const getRandomDbdPerkConfig = async (): Promise<RandomDbdPerkConfig | null> => {
    try {
        const response = await apiClient.get<RandomDbdPerkConfig>("/api/v1/random-dbd-perk");
        return response.data;
    } catch (error) {
        return null;
    }
};

export const enableRandomDbdPerk = async (enabled: boolean): Promise<RandomDbdPerkConfig | null> => {
    try {
        const response = await apiClient.post<RandomDbdPerkConfig>("/api/v1/random-dbd-perk", {
            enabled,
        });
        return response.data;
    } catch (error) {
        return null;
    }
};

export const updateRandomDbdPerkConfig = async (data: Partial<RandomDbdPerkConfig> & { classes?: Partial<RandomDbdPerkClass>[] }): Promise<RandomDbdPerkConfig | null> => {
    try {
        const response = await apiClient.put<RandomDbdPerkConfig>("/api/v1/random-dbd-perk", data);
        return response.data;
    } catch (error) {
        return null;
    }
};



export const getRandomDbdPerkEventUrl = (userId: string, key?: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const url = new URL(`${baseUrl}/api/v1/random-dbd-perk/sse/${userId}`);
    if (key) {
        url.searchParams.append("key", key);
    }
    return url.toString();
};

export const testRandomDbdPerk = async (eventData: any): Promise<void> => {
    await apiClient.post("/webhook/v1/twitch/event-sub/channel-redemption-add", eventData);
};


