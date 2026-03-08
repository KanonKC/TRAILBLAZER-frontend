import { apiClient } from "@/lib/api-client";

export interface User {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    twitchId: string;
    tier: number;
}

export const getCurrentUser = async (): Promise<User> => {
    const response = await apiClient.get<User>("/api/v1/user/me");
    console.log('user', response)
    return response.data;
};

export const logoutUser = async (): Promise<void> => {
    await apiClient.post("/api/v1/logout", {});
};
