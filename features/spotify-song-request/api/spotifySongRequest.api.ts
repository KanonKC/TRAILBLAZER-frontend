import { apiClient } from "@/lib/api-client";
import { SpotifySongRequestConfig } from "../types";

export const createSpotifySongRequest = async (twitchId: string, ownerId: string): Promise<SpotifySongRequestConfig> => {
    const response = await apiClient.post<SpotifySongRequestConfig>("/api/v1/spotify-song-request", {
        twitch_id: twitchId,
        owner_id: ownerId,
    });
    return response.data;
};

export const getSpotifySongRequestConfig = async (): Promise<SpotifySongRequestConfig> => {
    const response = await apiClient.get<SpotifySongRequestConfig>("/api/v1/spotify-song-request");
    return response.data;
};

export const updateSpotifySongRequestConfig = async (data: Partial<SpotifySongRequestConfig>): Promise<SpotifySongRequestConfig> => {
    const response = await apiClient.put<SpotifySongRequestConfig>("/api/v1/spotify-song-request", data);
    return response.data;
};

export const testInsertSpotifyTrack = async (twitchId: string, rewardId: string): Promise<void> => {
    await apiClient.post("/webhook/v1/twitch/event-sub/channel-chat-message", {
        subscription: { status: "enabled" },
        event: {
            broadcaster_user_id: twitchId,
            broadcaster_user_login: "",
            broadcaster_user_name: "",
            chatter_user_id: twitchId,
            chatter_user_login: "",
            chatter_user_name: "",
            message_id: `test-message-id-${Date.now()}`,
            message: {
                text: "https://open.spotify.com/track/0CWAQlHsvfqcKJVVz9up2R",
                fragments: [],
            },
            color: "",
            badges: [],
            message_type: "text",
            cheer: null,
            reply: null,
            channel_points_custom_reward_id: rewardId,
            source_broadcaster_user_id: null,
            source_broadcaster_user_login: null,
            source_broadcaster_user_name: null,
            source_message_id: null,
            source_badges: null,
        },
    });
};
