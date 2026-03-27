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

export interface ListChannelRewardsOptions {
    userInputRequired?: boolean;
}

export const getTwitchChannelRewards = async (options?: ListChannelRewardsOptions): Promise<TwitchCustomReward[]> => {
    const response = await apiClient.get<{ data: TwitchCustomReward[] }>(`/api/v1/twitch/channel-rewards`, {
        params: {
            user_input_required: options?.userInputRequired
        }
    });
    return response.data.data;
}

export interface TwitchUser {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    created_at: string;
}

export const getTwitchUser = async (username?: string): Promise<TwitchUser> => {
    const query = username ? `?username=${encodeURIComponent(username)}` : "";
    const response = await apiClient.get<TwitchUser>(`/api/v1/twitch/user${query}`);
    return response.data;
}
