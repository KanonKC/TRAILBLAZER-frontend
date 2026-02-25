import { apiClient } from "@/lib/api-client";

export interface UploadedFile {
    id: string;
    url: string;
    name: string;
    type: string;
    size: number;
    owner_id: string;
    key: string;
    created_at: string;
    updated_at: string;
}

export interface GetUploadedFilesParams {
    page?: number;
    limit?: number;
    search?: string;
    type?: "audio" | "image" | "video" | "other";
}

export interface GetUploadedFilesResponse {
    data: UploadedFile[];
    pagination: {
        total: number;
        page: number;
        limit: number;
    }
}

export const getUploadedFiles = async (params: GetUploadedFilesParams): Promise<GetUploadedFilesResponse> => {
    const response = await apiClient.get<GetUploadedFilesResponse>("/api/v1/uploaded-files", { params });
    return response.data;
};

export const uploadFile = async (file: File): Promise<UploadedFile> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<UploadedFile>("/api/v1/uploaded-files", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteUploadedFile = async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/uploaded-files/${id}`);
};

export const getUploadedFile = async (id: string): Promise<UploadedFile> => {
    const response = await apiClient.get<UploadedFile>(`/api/v1/uploaded-files/${id}`);
    return response.data;
};
