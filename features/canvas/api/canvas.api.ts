import { apiClient } from "@/lib/api-client";
import { Canvas, CanvasElementInput, CanvasVariable, CanvasWithLinks } from "../types";

export const listCanvases = async (): Promise<Canvas[]> => {
    const response = await apiClient.get<Canvas[]>("/api/v1/canvases");
    return response.data;
};

export const createCanvas = async (data: { name: string; duration_ms?: number }): Promise<Canvas> => {
    const response = await apiClient.post<Canvas>("/api/v1/canvases", data);
    return response.data;
};

export const getCanvas = async (id: string): Promise<CanvasWithLinks> => {
    const response = await apiClient.get<CanvasWithLinks>(`/api/v1/canvases/${id}`);
    return response.data;
};

export const updateCanvas = async (
    id: string,
    data: { name?: string; enabled?: boolean; duration_ms?: number; elements?: CanvasElementInput[] }
): Promise<CanvasWithLinks> => {
    const response = await apiClient.put<CanvasWithLinks>(`/api/v1/canvases/${id}`, data);
    return response.data;
};

export const deleteCanvas = async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/canvases/${id}`);
};

export const testCanvas = async (id: string): Promise<void> => {
    await apiClient.post(`/api/v1/canvases/${id}/test`);
};

export const getCanvasLinks = async (id: string): Promise<string[]> => {
    const response = await apiClient.get<{ widgetIds: string[] }>(`/api/v1/canvases/${id}/links`);
    return response.data.widgetIds;
};

export const updateCanvasLinks = async (id: string, widgetIds: string[]): Promise<void> => {
    await apiClient.put(`/api/v1/canvases/${id}/links`, { widgetIds });
};

export const getCanvasVariables = async (widgetTypes: string[]): Promise<CanvasVariable[]> => {
    const response = await apiClient.get<{ variables: CanvasVariable[] }>("/api/v1/canvases/variables", {
        params: { widgetTypes: widgetTypes.join(",") },
    });
    return response.data.variables;
};

export const getCanvasOverlayKey = async (): Promise<string | null> => {
    const response = await apiClient.get<{ overlayKey: string | null }>("/api/v1/canvas-overlay");
    return response.data.overlayKey;
};

export const refreshCanvasOverlayKey = async (): Promise<string> => {
    const response = await apiClient.post<{ overlayKey: string }>("/api/v1/canvas-overlay/refresh-key");
    return response.data.overlayKey;
};

export const getCanvasEventUrl = (userId: string, key?: string) => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
        console.error("NEXT_PUBLIC_API_URL is not set; falling back to localhost, which will not work outside local dev.");
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const url = new URL(`${baseUrl}/api/v1/events/canvas/${userId}`);
    if (key) {
        url.searchParams.append("key", key);
    }
    return url.toString();
};
