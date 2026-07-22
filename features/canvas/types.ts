export type CanvasElementType = "image" | "video" | "audio" | "text";

export type CanvasTransition =
    | "fade"
    | "slide-up"
    | "slide-down"
    | "slide-left"
    | "slide-right"
    | "zoom"
    | "pop"
    | "none";

export interface CanvasElementMedia {
    id: string;
    key: string;
    name: string;
    type: string;
    /** Short-lived signed URL, present on read responses so the editor can render the media. */
    url: string;
}

export interface CanvasElement {
    id: string;
    type: CanvasElementType;
    media_key: string | null;
    media: CanvasElementMedia | null;
    text_content: string | null;
    text_style: Record<string, unknown> | null;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    z_index: number;
    opacity: number;
    start_delay_ms: number;
    duration_ms: number;
    enter_transition: CanvasTransition;
    exit_transition: CanvasTransition;
    transition_ms: number;
    volume: number;
    loop: boolean;
}

export interface Canvas {
    id: string;
    name: string;
    enabled: boolean;
    duration_ms: number;
    owner_id: string;
    triggered_count: number;
    elements: CanvasElement[];
    created_at: string;
    updated_at: string;
}

export interface CanvasWithLinks extends Canvas {
    links: { widget: { id: string; widget_type_slug: string | null } }[];
}

export interface CanvasElementInput {
    id?: string;
    type: CanvasElementType;
    media_key?: string | null;
    text_content?: string | null;
    text_style?: Record<string, unknown> | null;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    rotation?: number;
    z_index?: number;
    opacity?: number;
    start_delay_ms?: number;
    duration_ms?: number;
    enter_transition?: CanvasTransition;
    exit_transition?: CanvasTransition;
    transition_ms?: number;
    volume?: number;
    loop?: boolean;
}

export interface CanvasVariable {
    key: string;
    label: string;
    sample_value: string;
}

export interface CanvasPlayElement {
    id: string;
    type: CanvasElementType;
    media_url: string | null;
    text_content: string | null;
    text_style: Record<string, unknown> | null;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    z_index: number;
    opacity: number;
    start_delay_ms: number;
    duration_ms: number;
    enter_transition: CanvasTransition;
    exit_transition: CanvasTransition;
    transition_ms: number;
    volume: number;
    loop: boolean;
}

export interface CanvasPlayEvent {
    userId: string;
    playId: string;
    canvasId: string;
    durationMs: number;
    elements: CanvasPlayElement[];
}
