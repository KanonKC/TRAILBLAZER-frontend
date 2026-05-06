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
import { File, Link2, LogOut, MessageSquare, RefreshCw, Upload, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "./user-context";
import { BrandLogo } from "@/components/brand-logo";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { getUserTier } from "@/services/user.service";
import { PricingTwitchDialog } from "@/app/pricing/_components/PricingTwitchDialog";
import { Discord } from "./icons/discord";
import { ReferralDialog } from "./referral-dialog";
import { Gift } from "lucide-react";

export default function Navbar() {
    const { user, isLoading, logout } = useUser();
    const pathname = usePathname();
    const [tier, setTier] = useState<number>(0);
    const [open, setOpen] = useState(false);
    const [referralOpen, setReferralOpen] = useState(false);

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
            <PricingTwitchDialog
                open={open}
                onOpenChange={setOpen}
            />
            <ReferralDialog
                open={referralOpen}
                onOpenChange={setReferralOpen}
            />
            <div className="flex h-16 items-center px-4 container mx-auto justify-between">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center font-bold text-xl tracking-tight shrink-0">
                        <BrandLogo />
                    </Link>

                    <div className="hidden md:flex items-center gap-8 ml-8">
                        <Link href="/dashboard/widgets" className="text-base font-medium transition-colors hover:text-primary">
                            Widgets
                        </Link>
                        <Link href="/pricing" className="text-base font-medium transition-colors hover:text-primary">
                            Pricing
                        </Link>
                        <a href="https://discord.gg/aH4X6PJ3kt" target="_blank" rel="noopener noreferrer" className="text-base font-medium transition-colors flex items-center gap-2 hover:bg-[#5865F2] hover:text-white p-2 rounded-md">
                            <Discord className="text-white w-5 h-5" />
                            <span>
                                Join Discord
                            </span>
                        </a>
                    </div>
                </div>


                <div className="flex items-center gap-2 sm:gap-4">
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                    ) : user ? (
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setReferralOpen(true)}
                                className="hidden sm:flex items-center gap-2 h-8 px-2 sm:h-10 sm:px-4"
                            >
                                <Gift className="w-4 h-4 text-primary" />
                                <span className="hidden lg:inline">Invite Friends</span>
                            </Button>
                            {tier === 0 && (
                                <Button 
                                    onClick={() => setOpen(true)} 
                                    className="trailblazer-gradient text-white font-bold text-sm h-8 px-2 sm:h-10 sm:px-4"
                                >
                                    <span className="hidden min-[400px]:inline">อัปเกรดเป็น</span> PRO
                                </Button>
                            )}
                            <div className="flex items-center gap-2">
                                {tier > 0 ? (
                                    <Badge variant="outline" className="trailblazer-gradient-text font-bold whitespace-nowrap">PRO</Badge>
                                ) : (
                                    <Badge variant="outline" className="whitespace-nowrap">FREE</Badge>
                                )}
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
                                            <Link href="/my/uploaded-files" className="cursor-pointer">
                                                <Upload className="mr-2 h-4 w-4" />
                                                จัดการไฟล์อัปโหลดของคุณ
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/my/account-binding" className="cursor-pointer">
                                                <Link2 className="mr-2 h-4 w-4" />
                                                เชื่อมต่อบัญชี
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <span onClick={handleReloadSubscription} className="cursor-pointer">
                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                อัปเดตข้อมูลการสมัครสมาชิก
                                            </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500 focus:text-red-500">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ) : (
                        pathname !== "/login" && (
                            <TwitchLoginButton className="h-8 px-3 text-sm sm:h-10 sm:px-4 sm:text-base" />
                        )
                    )}

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setReferralOpen(true)}>
                                    <Gift className="mr-2 h-4 w-4" />
                                    Invite Friends
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/widgets" className="w-full">
                                        Widgets
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/pricing" className="w-full">
                                        Pricing
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a href="https://discord.gg/aH4X6PJ3kt" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-full">
                                        <Discord className="w-4 h-4" />
                                        Join Discord
                                    </a>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    );
}
