"use client"

import React, { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser, logoutUser, type User } from "@/services/user.service";

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
            const userData = await getCurrentUser();
            setUser(userData);
            setIsLoading(false);
        };

        fetchUser();
    }, []);

    const logout = async () => {
        await logoutUser();
        setUser(null);
        window.location.href = "/";
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
