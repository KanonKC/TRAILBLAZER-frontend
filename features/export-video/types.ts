export interface ExportVideoConfig {
    id: string;
    enabled: boolean;
    privacy_status: string; // "PRIVATE" | "PUBLIC" | "UNLISTED"
    tags: string[];
    description: string | null;
    widget: {
        id: string;
        enabled: boolean;
    };
}

export interface ExportVideoHistory {
    id: number;
    batch_id: string | null;
    video_id: string;
    status: string; // "SUCCESS" | "FAILED"
    message: string | null;
    created_at: string;
    updated_at: string;
    export_video_id: string;
}
export interface ListResponse<T> {
    data: T[];
    pagination: {
        limit: number;
        page: number;
        total: number;
    }
}

export interface Pagination {
    page: number;
    limit: number;
    total?: number;
}
