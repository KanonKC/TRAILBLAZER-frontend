const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface User {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    twitchId: string;
}

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const res = await fetch(`${BASE_URL}/api/v1/user/me`, {
            credentials: "include",
        });

        if (res.ok) {
            return await res.json();
        } else if (res.status === 401) {
            // Try to refresh token
            const refreshSuccess = await refreshToken();
            if (refreshSuccess) {
                // Retry fetching user
                const retryRes = await fetch(`${BASE_URL}/api/v1/user/me`, {
                    credentials: "include",
                });
                if (retryRes.ok) {
                    return await retryRes.json();
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch user", error);
        return null;
    }
};

export const refreshToken = async (): Promise<boolean> => {
    try {
        const res = await fetch(`${BASE_URL}/api/v1/refresh-token`, {
            method: "POST",
            credentials: "include"
        });
        return res.ok;
    } catch (error) {
        console.error("Failed to refresh token", error);
        return false;
    }
};

export const logoutUser = async (): Promise<void> => {
    try {
        await fetch(`${BASE_URL}/api/v1/logout`, {
            method: "POST",
            credentials: "include",
        });
    } catch (error) {
        console.error("Failed to logout", error);
    }
};
