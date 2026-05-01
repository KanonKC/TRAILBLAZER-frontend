"use client"

import { useState, useEffect } from "react";
import { useUser } from "@/components/user-context";
import { tbToast } from "@/utils/tbToast";
import {
    getLinkedAccounts,
    bindAccount as bindAccountApi,
    unbindAccount as unbindAccountApi,
} from "../api/linkedAccount.api";
import { LinkedAccount } from "../types";

function generateState(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

function generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

const YOUTUBE_CLIENT_ID = process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID || "";
const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "";
const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";
const CALLBACK_URL = process.env.NEXT_PUBLIC_ACCOUNT_BINDING_CALLBACK_URL || "";

export const useAccountBinding = (initialAccounts: LinkedAccount[] | null) => {
    const { user, isLoading: isUserLoading } = useUser();
    const [accounts, setAccounts] = useState<LinkedAccount[]>(initialAccounts || []);
    const [isLoading, setIsLoading] = useState(false);
    const [unbindingPlatform, setUnbindingPlatform] = useState<string | null>(null);

    useEffect(() => {
        if (initialAccounts) {
            setAccounts(initialAccounts);
        }
    }, [initialAccounts]);

    const getAccountForPlatform = (platform: string): LinkedAccount | undefined => {
        return accounts.find((a) => a.platform === platform);
    };

    const handleBind = (platform: string) => {
        const state = generateState();

        // Store state and platform in sessionStorage for validation on callback
        sessionStorage.setItem("oauth_state", state);
        sessionStorage.setItem("oauth_platform", platform);

        // TODO notice this: All platforms share a single callback page.
        // If you need separate callback pages per platform in the future,
        // create /callback/youtube/page.tsx, /callback/discord/page.tsx instead.
        if (platform === "youtube") {
            const codeVerifier = generateCodeVerifier();
            sessionStorage.setItem("oauth_code_verifier", codeVerifier);

            const params = new URLSearchParams({
                client_id: YOUTUBE_CLIENT_ID,
                redirect_uri: CALLBACK_URL,
                response_type: "code",
                scope: "https://www.googleapis.com/auth/youtube.readonly",
                state: state,
                access_type: "offline",
                prompt: "consent",
                code_challenge: codeVerifier, // Simplified — in production, hash this with S256
                code_challenge_method: "plain",
            });
            window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
        }

        if (platform === "discord") {
            const params = new URLSearchParams({
                client_id: DISCORD_CLIENT_ID,
                redirect_uri: CALLBACK_URL,
                response_type: "code",
                scope: "identify",
                state: state,
            });
            window.location.href = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
        }

        if (platform === "spotify") {
            const params = new URLSearchParams({
                client_id: SPOTIFY_CLIENT_ID,
                redirect_uri: CALLBACK_URL,
                response_type: "code",
                scope: "user-read-private user-read-email",
                state: state,
                show_dialog: "true",
            });
            window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
        }
    };

    const handleUnbind = async (platform: string) => {
        setUnbindingPlatform(platform);
        try {
            await unbindAccountApi(platform);
            setAccounts((prev) => prev.filter((a) => a.platform !== platform));
            tbToast.success({ title: "ยกเลิกการเชื่อมต่อสำเร็จ" });
        } catch (error) {
            console.error("Failed to unbind account", error);
            tbToast.error({ title: "ไม่สามารถยกเลิกการเชื่อมต่อได้" });
        } finally {
            setUnbindingPlatform(null);
        }
    };

    const handleOAuthCallback = async (platform: string, code: string, codeVerifier?: string) => {
        setIsLoading(true);
        try {
            const linkedAccount = await bindAccountApi(platform, code, codeVerifier);
            setAccounts((prev) => [...prev, linkedAccount]);
            tbToast.success({ title: "เชื่อมต่อบัญชีสำเร็จ" });
            return true;
        } catch (error) {
            console.error("Failed to bind account", error);
            tbToast.error({ title: "ไม่สามารถเชื่อมต่อบัญชีได้" });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const refreshAccounts = async () => {
        try {
            const freshAccounts = await getLinkedAccounts();
            setAccounts(freshAccounts);
        } catch (error) {
            console.error("Failed to refresh accounts", error);
        }
    };

    return {
        user,
        isUserLoading,
        accounts,
        isLoading,
        unbindingPlatform,
        getAccountForPlatform,
        handleBind,
        handleUnbind,
        handleOAuthCallback,
        refreshAccounts,
    };
};
