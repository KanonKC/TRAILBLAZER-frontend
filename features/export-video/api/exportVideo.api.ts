import { apiClient } from "@/lib/api-client";
import { ExportVideoConfig, ExportVideoHistory, ListResponse } from "../types";

/**
 * ExportVideo API layer (Repository)
 */

export const getExportVideoConfig = async (): Promise<ExportVideoConfig> => {
    const response = await apiClient.get<ExportVideoConfig>("/api/v1/export-video");
    return response.data;
};

export const enableExportVideo = async (twitchId: string, ownerId: string): Promise<ExportVideoConfig> => {
    const response = await apiClient.post<ExportVideoConfig>("/api/v1/export-video", {
        twitch_id: twitchId,
        owner_id: ownerId,
    });
    return response.data;
};

export const updateExportVideoConfig = async (data: Partial<ExportVideoConfig>): Promise<ExportVideoConfig> => {
    const response = await apiClient.put<ExportVideoConfig>("/api/v1/export-video", data);
    return response.data;
};

export const listExportVideoHistory = async (page = 1, limit = 10): Promise<ListResponse<ExportVideoHistory>> => {
    const response = await apiClient.get<ListResponse<ExportVideoHistory>>(`/api/v1/export-video/history?page=${page}&limit=${limit}`);
    return response.data;
};

export const deleteExportVideoHistory = async (historyId: number): Promise<boolean> => {
    await apiClient.delete(`/api/v1/export-video/history/${historyId}`);
    return true;
};

export const testExportVideo = async (): Promise<boolean> => {
    await apiClient.post("/api/v1/export-video/test");
    return true;
};
