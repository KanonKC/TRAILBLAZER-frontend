import { apiClient } from "@/lib/api-client";
import { FirstWordConfig, FirstWordCustomReply, ListResponse } from "../types";

/**
 * FirstWord API layer (Repository)
 * This file contains pure API calls, unaware of React/Redux.
 */

export const getFirstWordConfig = async (): Promise<FirstWordConfig> => {
    const response = await apiClient.get<FirstWordConfig>("/api/v1/first-word");
    return response.data;
};

export const enableFirstWord = async (twitchId: string, ownerId: string): Promise<FirstWordConfig> => {
    const response = await apiClient.post<FirstWordConfig>("/api/v1/first-word", {
        twitch_id: twitchId,
        owner_id: ownerId,
    });
    return response.data;
};

export const updateFirstWordConfig = async (data: Partial<FirstWordConfig>): Promise<FirstWordConfig> => {
    const response = await apiClient.put<FirstWordConfig>("/api/v1/first-word", data);
    return response.data;
};

export const listCustomReplies = async (search?: string): Promise<ListResponse<FirstWordCustomReply>> => {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const response = await apiClient.get<ListResponse<FirstWordCustomReply>>(`/api/v1/first-word/custom-replies${query}`);
    return response.data;
};

export const createCustomReply = async (data: { 
    twitch_chatter_id: string; 
    reply_message?: string | null; 
    audio_key?: string | null; 
    audio_volume?: number 
}): Promise<FirstWordCustomReply> => {
    const response = await apiClient.post<FirstWordCustomReply>("/api/v1/first-word/custom-replies", data);
    return response.data;
};

export const updateCustomReply = async (id: string, data: { 
    twitch_chatter_id?: string; 
    reply_message?: string | null; 
    audio_key?: string | null; 
    audio_volume?: number 
}): Promise<FirstWordCustomReply> => {
    const response = await apiClient.put<FirstWordCustomReply>(`/api/v1/first-word/custom-replies/${id}`, data);
    return response.data;
};

export const deleteCustomReply = async (id: string): Promise<boolean> => {
    await apiClient.delete(`/api/v1/first-word/custom-replies/${id}`);
    return true;
};

export const testFirstWordAudio = async (eventData: any): Promise<void> => {
    await apiClient.post("/webhook/v1/twitch/event-sub/channel-chat-message", eventData);
};

export const refreshFirstWordOverlayKey = async (): Promise<FirstWordConfig> => {
    const response = await apiClient.post<FirstWordConfig>("/api/v1/first-word/refresh-key");
    return response.data;
};

export const listChatters = async (): Promise<ListResponse<any>> => {
    const response = await apiClient.get<ListResponse<any>>("/api/v1/first-word/chatters");
    return response.data;
};

export const resetChatters = async (): Promise<boolean> => {
    await apiClient.post("/api/v1/first-word/chatters/reset");
    return true;
};

export const getFirstWordEventUrl = (userId: string, key?: string): string => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const url = `${BASE_URL}/api/v1/events/first-word/${userId}`;
    if (key) {
        return `${url}?key=${key}`;
    }
    return url;
};
