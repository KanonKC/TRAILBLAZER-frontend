import { apiClient } from "@/lib/api-client";
import { UploadedFile } from "./uploadedFile.service";

export interface FirstWordConfig {
    id: string;
    twitch_id: string;
    owner_id: string;
    reply_message: string | null;
    enabled: boolean;
    audio_key?: string | null;
    twitch_bot_id?: string | null;
    audio: UploadedFile
    widget: {
        id: string;
        overlay_key: string;
    }
}

export interface FirstWordCustomReply {
    id: string;
    first_word_id: string;
    twitch_chatter_id: string;
    twitch_chatter_username: string;
    twitch_chatter_avatar_url: string;
    reply_message: string | null;
    audio_key: string | null;
    audio: UploadedFile | null;
    created_at: string;
    updated_at: string;
}

export interface ListResponse<T> {
    data: T[];
    total: number;
}

export const getFirstWordConfig = async (): Promise<FirstWordConfig | null> => {
    try {
        const response = await apiClient.get<FirstWordConfig>("/api/v1/first-word");
        return response.data;
    } catch (error) {
        return null;
    }
};

export const enableFirstWord = async (twitchId: string, ownerId: string): Promise<FirstWordConfig | null> => {
    try {
        const response = await apiClient.post<FirstWordConfig>("/api/v1/first-word", {
            twitch_id: twitchId,
            owner_id: ownerId,
        });
        return response.data;
    } catch (error) {
        return null;
    }
};

export const updateFirstWordConfig = async (data: Partial<FirstWordConfig>): Promise<FirstWordConfig | null> => {
    try {
        const response = await apiClient.put<FirstWordConfig>("/api/v1/first-word", data);
        return response.data;
    } catch (error) {
        return null;
    }
};

export const listCustomReplies = async (search?: string): Promise<ListResponse<FirstWordCustomReply> | null> => {
    try {
        const query = search ? `?search=${encodeURIComponent(search)}` : "";
        const response = await apiClient.get<ListResponse<FirstWordCustomReply>>(`/api/v1/first-word/custom-replies${query}`);
        return response.data;
    } catch (error) {
        return null;
    }
};

export const createCustomReply = async (data: { twitch_chatter_id: string; reply_message?: string | null; audio_key?: string | null }): Promise<FirstWordCustomReply | null> => {
    try {
        const response = await apiClient.post<FirstWordCustomReply>("/api/v1/first-word/custom-replies", data);
        return response.data;
    } catch (error) {
        return null;
    }
};

export const updateCustomReply = async (id: string, data: { twitch_chatter_id?: string; reply_message?: string | null; audio_key?: string | null }): Promise<FirstWordCustomReply | null> => {
    try {
        const response = await apiClient.put<FirstWordCustomReply>(`/api/v1/first-word/custom-replies/${id}`, data);
        return response.data;
    } catch (error) {
        return null;
    }
};

export const deleteCustomReply = async (id: string): Promise<boolean> => {
    try {
        await apiClient.delete(`/api/v1/first-word/custom-replies/${id}`);
        return true;
    } catch (error) {
        return false;
    }
};

// export const uploadFirstWordAudio = async (file: File): Promise<boolean> => {
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//         await apiClient.post("/api/v1/first-word/audio", formData, {
//             headers: {
//                 "Content-Type": "multipart/form-data",
//             },
//         });
//         return true;
//     } catch (error) {
//         return false;
//     }
// };



export const testFirstWordAudio = async (eventData: any): Promise<void> => {
    // Note: Webhook endpoint is usually not called by frontend client directly in production loop, 
    // but useful for testing. Using apiClient ensures auth if needed (though webhooks might be public/different auth).
    // Assuming this is a protected test endpoint or similar.
    await apiClient.post("/webhook/v1/twitch/event-sub/channel-chat-message", eventData);
};

export const refreshFirstWordOverlayKey = async (): Promise<FirstWordConfig | null> => {
    try {
        const response = await apiClient.post<FirstWordConfig>("/api/v1/first-word/refresh-key");
        return response.data;
    } catch (error) {
        return null;
    }
};

export const getFirstWordEventUrl = (userId: string, key?: string): string => {
    // This returns a URL string for SSE, so we can't use apiClient directly for the connection itself 
    // without using a specialized SSE client that handles headers. 
    // Standard EventSource doesn't support custom headers easily, but does support cookies.
    // Since we rely on cookies, this URL is fine.
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const url = `${BASE_URL}/api/v1/events/first-word/${userId}`;
    if (key) {
        return `${url}?key=${key}`;
    }
    return url;
};
