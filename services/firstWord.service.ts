import { apiClient } from "@/lib/api-client";

export interface FirstWordConfig {
    id: string;
    twitch_id: string;
    owner_id: string;
    reply_message: string | null;
    enabled: boolean;
    audio_key?: string | null;
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

export const uploadFirstWordAudio = async (file: File): Promise<boolean> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        await apiClient.post("/api/v1/first-word/audio", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return true;
    } catch (error) {
        return false;
    }
};

export const testFirstWordAudio = async (eventData: any): Promise<void> => {
    // Note: Webhook endpoint is usually not called by frontend client directly in production loop, 
    // but useful for testing. Using apiClient ensures auth if needed (though webhooks might be public/different auth).
    // Assuming this is a protected test endpoint or similar.
    await apiClient.post("/webhook/v1/twitch/event-sub/chat-message-events", eventData);
};

export const getFirstWordEventUrl = (userId: string): string => {
    // This returns a URL string for SSE, so we can't use apiClient directly for the connection itself 
    // without using a specialized SSE client that handles headers. 
    // Standard EventSource doesn't support custom headers easily, but does support cookies.
    // Since we rely on cookies, this URL is fine.
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    return `${BASE_URL}/api/v1/events/first-word/${userId}`;
};
