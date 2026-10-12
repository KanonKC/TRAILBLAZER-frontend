import { apiClient } from "@/lib/api-client";
import { Canvas, SaveCanvasRequest } from "../types";

export const getCanvases = async (): Promise<Canvas[]> => {
    const response = await apiClient.get<Canvas[]>("/api/v1/canvases");
    return response.data;
};

export const getCanvas = async (id: string): Promise<Canvas> => {
    const response = await apiClient.get<Canvas>(`/api/v1/canvases/${id}`);
    return response.data;
};

export const createCanvas = async (data: SaveCanvasRequest): Promise<Canvas> => {
    const response = await apiClient.post<Canvas>("/api/v1/canvases", data);
    return response.data;
};

export const updateCanvas = async (id: string, data: SaveCanvasRequest): Promise<Canvas> => {
    const response = await apiClient.put<Canvas>(`/api/v1/canvases/${id}`, data);
    return response.data;
};

export const deleteCanvas = async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/canvases/${id}`);
};

/** A widget plays at most one canvas; null unlinks it. */
export const setWidgetCanvas = async (widgetId: string, canvasId: string | null): Promise<void> => {
    await apiClient.put(`/api/v1/widgets/${widgetId}/canvas`, { canvas_id: canvasId });
};
