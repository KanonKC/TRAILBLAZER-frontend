"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { TwitchLoginButton } from "@/components/button/TwitchLoginButton";
import { File, Link2, LogOut, MessageSquare, RefreshCw, Upload } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "./user-context";
import { BrandLogo } from "@/components/brand-logo";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { getUserTier } from "@/services/user.service";

export default function Navbar() {
    const { user, isLoading, logout } = useUser();
    const pathname = usePathname();
    const [tier, setTier] = useState<number>(0);

    useEffect(() => {
        if (!user) return;
        getUserTier({ forceTwitch: false }).then((tier) => {
            setTier(tier.tier);
        });
    }, [user]);

    const handleReloadSubscription = async () => {
        const tier = await getUserTier({ forceTwitch: true });
        setTier(tier.tier);
    };

    // Hide navbar on overlay pages
    if (pathname?.startsWith("/overlays")) {
        return null;
    }

    // Twitch OAuth URL

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 container mx-auto justify-between">
                <Link href="/" className="flex items-center font-bold text-xl tracking-tight">
                    <BrandLogo />
                </Link>

                <div className="flex w-full items-center gap-12 ml-12">
                    <Link href="/dashboard/widgets" className="text-base font-medium transition-colors hover:text-primary">
                        Widgets
                    </Link>
                    <Link href="/pricing" className="text-base font-medium transition-colors hover:text-primary">
                        Pricing
                    </Link>
                    <a href="https://discord.gg/aH4X6PJ3kt" target="_blank" rel="noopener noreferrer" className="text-base font-medium transition-colors hover:text-primary flex items-center gap-2">
                        Community
                    </a>
                </div>

                <div className="flex items-center gap-4">
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                    ) : user ? (
                        <div className="flex items-center gap-2">
                            {tier > 0 ? <Badge variant="outline" className="trailblazer-gradient-text font-bold">PRO</Badge> : <Badge variant="outline">FREE</Badge>}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatarUrl} alt={user.username} />
                                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm text-white font-medium leading-none">{user.displayName}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.username}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/my/uploaded-files" className="cursor-pointer hover:bg-primary">
                                            <Upload className="mr-2 h-4 w-4" />
                                            จัดการไฟล์อัปโหลดของคุณ
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <span onClick={handleReloadSubscription} className="cursor-pointer hover:bg-primary">
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            อัปเดตข้อมูลการสมัครสมาชิก
                                        </span>
                                    </DropdownMenuItem>
                                    {/* TODO: Remove this when we have a proper account binding page */}
                                    {/* <DropdownMenuSeparator/>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/account-binding" className="cursor-pointer">
                                            <Link2 className="mr-2 h-4 w-4" />
                                            เชื่อมต่อบัญชี
                                        </Link>
                                    </DropdownMenuItem> */}
                                    <DropdownMenuItem asChild>
                                        <a href="https://discord.gg/aH4X6PJ3kt" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:bg-primary flex items-center">
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            ช่วยเหลือและสนับสนุน (Discord)
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500 focus:text-red-500">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <TwitchLoginButton />
                    )}
                </div>
            </div>
        </nav>
    );
}
