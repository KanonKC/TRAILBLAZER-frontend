export type CanvasTemplateType = "image_audio" | "video";
export type CanvasMediaSlot = "image" | "audio" | "video";

export interface CanvasMedia {
    key: string;
    name: string;
    type: string;
    url: string;
    duration_ms: number | null;
}

export interface Canvas {
    id: string;
    name: string;
    template_type: CanvasTemplateType;
    enabled: boolean;
    duration_ms: number;
    volume: number;
    image: CanvasMedia | null;
    audio: CanvasMedia | null;
    video: CanvasMedia | null;
    widget_ids: string[];
    triggered_count: number;
    created_at: string;
    updated_at: string;
}

export interface SaveCanvasRequest {
    name: string;
    template_type: CanvasTemplateType;
    enabled?: boolean;
    duration_ms?: number;
    image_key?: string | null;
    audio_key?: string | null;
    video_key?: string | null;
    volume?: number;
}

/** What an overlay receives to play a canvas. */
export interface CanvasPlayback {
    canvas_id: string;
    template_type: CanvasTemplateType;
    image_url: string | null;
    audio_url: string | null;
    video_url: string | null;
    volume: number;
    duration_ms: number;
}
