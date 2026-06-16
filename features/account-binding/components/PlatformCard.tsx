import { LinkedAccount } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { PlatformConfig } from "@/constants/platforms";
import { cn } from "@/lib/utils";


export interface PlatformCardProps {
    platform: PlatformConfig;
    isConnected: boolean;
    linkedAccount: LinkedAccount | null;
    twitchUser: { username: string; displayName: string; avatarUrl: string } | null;
    isUnbinding: boolean;
    isBindLoading: boolean;
    onBind: () => void;
    onUnbind: () => void;
    size?: "medium" | "large";
}

export function PlatformCard({
    platform,
    isConnected,
    linkedAccount,
    twitchUser,
    isUnbinding,
    isBindLoading,
    onBind,
    onUnbind,
    size = "large"
}: PlatformCardProps) {
    const Icon = platform.icon;

    const displayName = twitchUser?.displayName || linkedAccount?.platform_username || "";
    const avatarUrl = twitchUser?.avatarUrl || linkedAccount?.platform_avatar_url || "";

    return (
        <Card className={`relative overflow-hidden border-border/50 transition-all duration-300 hover:border-border/80`}>
            {/* Subtle gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${platform.bgGradient} opacity-50`} />

            <CardContent className={cn("relative flex items-center justify-between", {
                "px-5": size === "medium",
                "p-5": size === "large"
            })}>
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
