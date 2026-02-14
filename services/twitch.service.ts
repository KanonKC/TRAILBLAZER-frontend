import { apiClient } from "@/lib/api-client";

export interface TwitchCustomReward {
    id: string;
    title: string;
    prompt: string;
    cost: number;
    image: {
        url_1x: string;
        url_2x: string;
        url_4x: string;
    } | null;
    default_image: {
        url_1x: string;
        url_2x: string;
        url_4x: string;
    } | null;
    background_color: string;
    is_enabled: boolean;
}

export const getTwitchChannelRewards = async (): Promise<TwitchCustomReward[]> => {
    try {
        const response = await apiClient.get<{ data: TwitchCustomReward[] }>("/api/v1/twitch/channel-rewards");
        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch Twitch rewards", error);
        return [];
    }
}
