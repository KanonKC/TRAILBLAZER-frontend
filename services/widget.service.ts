import { apiClient } from "@/lib/api-client";

export interface WidgetType {
    id: number;
    slug: string;
    displayName: string;
    cost: number;
    createdAt: string;
    updatedAt: string;
}

export interface Widget {
    id: string;
    twitch_id: string;
    enabled: boolean;
    overlay_key: string | null;
    owner_id: string;
    widget_type_slug: string | null;
    created_at: string;
    updated_at: string;
}

export interface ExtendedWidget extends Widget {
    widget_type: WidgetType | null;
}

export const updateWidgetEnabled = async (id: string, enabled: boolean): Promise<boolean> => {
    await apiClient.patch(`/api/v1/widgets/${id}/enable`, { enabled });
    return true;
};

export const refreshWidgetKey = async (id: string): Promise<{ overlay_key: string }> => {
    const response = await apiClient.patch<{ overlay_key: string }>(`/api/v1/widgets/${id}/refresh-key`);
    return response.data;
};

export const deleteWidget = async (id: string): Promise<boolean> => {
    await apiClient.delete(`/api/v1/widgets/${id}`);
    return true;
};

export const getFirstEnabledWidget = async (): Promise<ExtendedWidget | null> => {
    const response = await apiClient.get<ExtendedWidget>('/api/v1/widgets/first-enabled');
    return response.data;
};

export const listWidgets = async (params?: { page?: number, limit?: number, enabled?: boolean }): Promise<{ data: ExtendedWidget[], pagination: { page: number, limit: number, total: number } }> => {
    const response = await apiClient.get<{ data: ExtendedWidget[], pagination: { page: number, limit: number, total: number } }>('/api/v1/widgets', { params });
    return response.data;
};

export interface WidgetQuota {
    total_quota: number;
    used_quota: number;
    remaining_quota: number;
}

export const getWidgetQuota = async (): Promise<WidgetQuota> => {
    const response = await apiClient.get<WidgetQuota>('/api/v1/widgets/quota');
    return response.data;
};

export interface WidgetTypeMeta {
    id: number;
    slug: string;
    display_name: string;
    description: string | null;
    cost: number;
    icon_url: string | null;
    theme_color: string | null;
    href: string | null;
    is_active: boolean;
}

export const listWidgetTypes = async (): Promise<{ data: WidgetTypeMeta[] }> => {
    const response = await apiClient.get<{ data: WidgetTypeMeta[] }>('/api/v1/widget-types');
    return response.data;
};
