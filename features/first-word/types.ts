import { UploadedFile } from "@/services/uploadedFile.service";

export interface FirstWordConfig {
    id: string;
    twitch_id: string;
    owner_id: string;
    reply_message: string | null;
    enabled: boolean;
    audio_key?: string | null;
    audio_volume?: number;
    twitch_bot_id?: string | null;
    audio: UploadedFile | null;
    widget: {
        id: string;
        overlay_key: string;
        enabled: boolean;
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
    audio_volume: number;
    audio: UploadedFile | null;
    created_at: string;
    updated_at: string;
}

export interface ListResponse<T> {
    data: T[];
    pagination: {
        limit: number;
        page: number;
        total: number;
    }
}
