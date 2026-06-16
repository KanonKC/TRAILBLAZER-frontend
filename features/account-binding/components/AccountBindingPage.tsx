"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { Platforms } from "@/constants/platforms";
import { Link2 } from "lucide-react";
import { useAccountBinding } from "../hooks/useAccountBinding";
import { PlatformCard } from "./PlatformCard";

interface AccountBindingPageProps {
    initialAccounts: import("../types").LinkedAccount[] | null;
}

const AvailablePlatforms = [
    Platforms.Twitch,
    Platforms.Discord,
    Platforms.Spotify,
]

export function AccountBindingPage({ initialAccounts }: AccountBindingPageProps) {
    const {
        user,
        isUserLoading,
        isLoading,
        unbindingPlatform,
        getAccountForPlatform,
        handleBind,
        handleUnbind,
    } = useAccountBinding(initialAccounts);

    if (isUserLoading) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-3xl space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-28 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-3xl text-center text-muted-foreground">
                กรุณาเข้าสู่ระบบเพื่อจัดการบัญชีที่เชื่อมต่อ
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-3xl">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Link2 className="h-7 w-7 text-primary" />
                    <h1 className="text-2xl font-bold">เชื่อมต่อบัญชี</h1>
                </div>
                <p className="text-muted-foreground text-sm">
                    จัดการบัญชีแพลตฟอร์มที่เชื่อมต่อกับ TRAILBLAZER
                </p>
            </div>

            <div className="space-y-4">
                {AvailablePlatforms.map((platform) => {
                    // TODO: Also make linked account support for Twitch later
                    const isTwitch = platform.key === "twitch";
                    const linkedAccount = isTwitch ? null : getAccountForPlatform(platform.key) || null;
                    const isConnected = isTwitch || !!linkedAccount;

                    return (
                        <PlatformCard
                            key={platform.key}
                            platform={platform}
                            isConnected={isConnected}
                            linkedAccount={linkedAccount}
                            twitchUser={isTwitch ? user : null}
                            isUnbinding={unbindingPlatform === platform.key}
                            isBindLoading={isLoading}
                            onBind={() => handleBind(platform.key)}
                            onUnbind={() => handleUnbind(platform.key)}
                        />
                    );
                })}
            </div>
        </div>
    );
}
