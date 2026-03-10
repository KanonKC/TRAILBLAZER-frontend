import { apiClient } from "@/lib/api-client";

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
