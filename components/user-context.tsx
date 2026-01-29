"use client"

import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    twitchId: string;
}

interface UserContextType {
    user: User | null;
    isLoading: boolean;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Fetch user from backend using cookies
                // Note: credentials: 'include' is crucial for sending cookies
                console.log("Fetching user...");
                const res = await fetch("http://localhost:8080/api/v1/user/me", {
                    credentials: "include",
                });

                console.log(res);

                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                } else if (res.status === 401) {
                    // Try to refresh token
                    console.log("Access token expired, attempting refesh...");
                    const refreshRes = await fetch("http://localhost:8080/api/v1/refresh-token", {
                        method: "POST",
                        credentials: "include"
                    });

                    if (refreshRes.ok) {
                        console.log("Token refreshed, retrying user fetch...");
                        // Retry fetching user
                        const retryRes = await fetch("http://localhost:8080/api/v1/user/me", {
                            credentials: "include",
                        });

                        if (retryRes.ok) {
                            const userData = await retryRes.json();
                            setUser(userData);
                        } else {
                            setUser(null);
                        }
                    } else {
                        console.log("Refresh failed");
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Failed to fetch user", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    const logout = async () => {
        try {
            await fetch("http://localhost:8080/api/v1/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Failed to logout", error);
        } finally {
            setUser(null);
            // Optional: redirect to home or login page
            window.location.href = "/";
        }
    };

    return (
        <UserContext.Provider value={{ user, isLoading, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
