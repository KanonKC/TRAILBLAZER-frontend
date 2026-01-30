import { apiClient } from "@/lib/api-client";

export interface User {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    twitchId: string;
}

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const response = await apiClient.get<User>("/api/v1/user/me");
        return response.data;
    } catch (error) {
        // console.error("Failed to fetch user", error);
        return null;
    }
};

export const logoutUser = async (): Promise<void> => {
    try {
        await apiClient.post("/api/v1/logout", {});
    } catch (error) {
        console.error("Failed to logout", error);
    }
};
