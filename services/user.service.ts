import { apiClient } from "@/lib/api-client";

export interface User {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    twitchId: string;
}

export const getCurrentUser = async (): Promise<User> => {
    const response = await apiClient.get<User>("/api/v1/user/me");
    return response.data;
};

export const logoutUser = async (): Promise<void> => {
    await apiClient.post("/api/v1/logout", {});
};
