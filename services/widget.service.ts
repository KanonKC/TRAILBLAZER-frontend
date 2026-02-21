import { apiClient } from "@/lib/api-client";

export const updateWidgetEnabled = async (id: string, enabled: boolean): Promise<boolean> => {
    try {
        await apiClient.put(`/api/v1/widgets/${id}`, { enabled });
        return true;
    } catch (error) {
        console.error("Failed to update widget enabled status", error);
        return false;
    }
};

export const refreshWidgetKey = async (id: string): Promise<{ overlay_key: string } | null> => {
    try {
        const response = await apiClient.patch<{ overlay_key: string }>(`/api/v1/widgets/${id}/refresh-key`);
        return response.data;
    } catch (error) {
        console.error("Failed to refresh widget key", error);
        return null;
    }
};

export const deleteWidget = async (id: string): Promise<boolean> => {
    try {
        await apiClient.delete(`/api/v1/widgets/${id}`);
        return true;
    } catch (error) {
        console.error("Failed to delete widget", error);
        return false;
    }
};
