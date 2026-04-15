"use client"

import { useAccountBinding } from "../hooks/useAccountBinding";
import { LinkedAccount } from "../types";
import { Twitch } from "@/components/icons/twitch";
import { YouTube } from "@/components/icons/youtube";
import { Discord } from "@/components/icons/discord";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Lock, Link2, Unlink } from "lucide-react";

interface PlatformConfig {
    key: string;
    name: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
    bgGradient: string;
    canUnbind: boolean;
}

const PLATFORMS: PlatformConfig[] = [
    {
        key: "twitch",
        name: "Twitch",
        icon: Twitch,
        color: "#9146FF",
        bgGradient: "from-[#9146FF]/20 to-[#6441A5]/10",
        canUnbind: false,
    },
    {
        key: "youtube",
        name: "YouTube",
        icon: YouTube,
        color: "#FF0000",
        bgGradient: "from-[#FF0000]/20 to-[#CC0000]/10",
        canUnbind: true,
    },
    {
        key: "discord",
        name: "Discord",
        icon: Discord,
        color: "#5865F2",
        bgGradient: "from-[#5865F2]/20 to-[#4752C4]/10",
        canUnbind: true,
    },
];

interface AccountBindingPageProps {
    initialAccounts: LinkedAccount[] | null;
}

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
                    จัดการบัญชีแพลตฟอร์มที่เชื่อมต่อกับ Trailblazer
                </p>
            </div>

            <div className="space-y-4">
                {PLATFORMS.map((platform) => {
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

interface PlatformCardProps {
    platform: PlatformConfig;
    isConnected: boolean;
    linkedAccount: LinkedAccount | null;
    twitchUser: { username: string; displayName: string; avatarUrl: string } | null;
    isUnbinding: boolean;
    isBindLoading: boolean;
    onBind: () => void;
    onUnbind: () => void;
}

function PlatformCard({
    platform,
    isConnected,
    linkedAccount,
    twitchUser,
    isUnbinding,
    isBindLoading,
    onBind,
    onUnbind,
}: PlatformCardProps) {
    const Icon = platform.icon;

    const displayName = twitchUser?.displayName || linkedAccount?.platform_username || "";
    const avatarUrl = twitchUser?.avatarUrl || linkedAccount?.platform_avatar_url || "";

    return (
        <Card className={`relative overflow-hidden border-border/50 transition-all duration-300 hover:border-border/80`}>
            {/* Subtle gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${platform.bgGradient} opacity-50`} />

            <CardContent className="relative flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                    {/* Platform icon with brand color */}
                    <div
                        className="flex items-center justify-center h-12 w-12 rounded-xl"
                        style={{ backgroundColor: `${platform.color}20` }}
                    >
                        <Icon className="h-6 w-6" style={{ color: platform.color }} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-base">{platform.name}</span>
                            {isConnected && !platform.canUnbind && (
                                <Badge variant="outline" className="text-sm gap-1 border-primary/30 text-primary">
                                    <Lock className="h-3 w-3" />
                                    บัญชีหลัก
                                </Badge>
                            )}
                            {isConnected && platform.canUnbind && (
                                <Badge variant="outline" className="text-sm gap-1 border-emerald-500/30 text-emerald-400">
                                    เชื่อมต่อแล้ว
                                </Badge>
                            )}
                        </div>

                        {isConnected ? (
                            <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5">
                                    <AvatarImage src={avatarUrl} alt={displayName} />
                                    <AvatarFallback className="text-sm">
                                        {displayName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-muted-foreground">{displayName}</span>
                            </div>
                        ) : (
                            <span className="text-sm text-muted-foreground">ไม่ได้เชื่อมต่อ</span>
                        )}
                    </div>
                </div>

                <div>
                    {!isConnected && (
                        <Button
                            onClick={onBind}
                            disabled={isBindLoading}
                            variant="outline"
                            className="gap-2 hover:border-white/30 transition-all duration-200"
                        >
                            <Link2 className="h-4 w-4" />
                            เชื่อมต่อ
                        </Button>
                    )}

                    {isConnected && platform.canUnbind && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    disabled={isUnbinding}
                                    className="gap-2 text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                                >
                                    <Unlink className="h-4 w-4" />
                                    {isUnbinding ? "กำลังยกเลิก..." : "ยกเลิกการเชื่อมต่อ"}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        ยกเลิกการเชื่อมต่อ {platform.name}?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        คุณต้องการยกเลิกการเชื่อมต่อบัญชี {platform.name} ({displayName}) หรือไม่?
                                        คุณสามารถเชื่อมต่อใหม่ได้อีกครั้งภายหลัง
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={onUnbind}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        ยืนยันยกเลิกการเชื่อมต่อ
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
