import { apiClient } from "@/lib/api-client";

export interface User {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    twitchId: string;
    tier: number;
    hasTwitchGqlToken?: boolean;
}

export interface GetUserTierResponse {
    tier: number;
}

export const getCurrentUser = async (): Promise<User> => {
    const response = await apiClient.get<User>("/api/v1/user/me");
    return response.data;
};

export const logoutUser = async (): Promise<void> => {
    await apiClient.post("/api/v1/logout", {});
};

export const getUserTier = async ({ forceTwitch = false }: { forceTwitch?: boolean }): Promise<GetUserTierResponse> => {
    const response = await apiClient.get<GetUserTierResponse>(`/api/v1/user/tier`, { params: { force: forceTwitch } });
    return response.data;
};

