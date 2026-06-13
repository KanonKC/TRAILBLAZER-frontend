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
