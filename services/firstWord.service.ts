const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface FirstWordConfig {
    id: string;
    twitch_id: string;
    owner_id: string;
    reply_message: string | null;
    enabled: boolean;
    audio_key?: string | null;
}

export const getFirstWordConfig = async (): Promise<FirstWordConfig | null> => {
    const res = await fetch(`${BASE_URL}/api/v1/first-word`, {
        credentials: "include"
    });
    if (res.ok) {
        return await res.json();
    }
    return null;
};

export const enableFirstWord = async (twitchId: string, ownerId: string): Promise<FirstWordConfig | null> => {
    const res = await fetch(`${BASE_URL}/api/v1/first-word`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            twitch_id: twitchId,
            owner_id: ownerId,
        }),
        credentials: "include"
    });

    if (res.ok) {
        return getFirstWordConfig();
    }
    return null;
};

export const updateFirstWordConfig = async (data: Partial<FirstWordConfig>): Promise<FirstWordConfig | null> => {
    const res = await fetch(`${BASE_URL}/api/v1/first-word`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include"
    });

    if (res.ok) {
        return await res.json();
    }
    return null;
};

export const uploadFirstWordAudio = async (file: File): Promise<boolean> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${BASE_URL}/api/v1/first-word/audio`, {
        method: "POST",
        body: formData,
        credentials: "include"
    });

    return res.ok;
};

export const testFirstWordAudio = async (eventData: any): Promise<void> => {
    await fetch(`${BASE_URL}/webhook/v1/twitch/event-sub/chat-message-events`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(eventData)
    });
};

export const getFirstWordEventUrl = (userId: string): string => {
    return `${BASE_URL}/api/v1/events/first-word/${userId}`;
};
