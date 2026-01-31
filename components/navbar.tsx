"use client"

import { useUser } from "./user-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { user, isLoading, logout } = useUser();
    const pathname = usePathname();

    // Hide navbar on overlay pages
    if (pathname?.startsWith("/overlays")) {
        return null;
    }

    // Twitch OAuth URL
    const LOGIN_URL = "https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=lnn0xjhakjukg3r77tgnjpquxt1y2t&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fv1%2Flogin&scope=channel%3Abot+user%3Aread%3Aemail+user%3Aread%3Achat+user%3Awrite%3Achat+user%3Abot+channel%3Aread%3Asubscriptions&state=c3ab8aa609ea11e793ae92361f002671";

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 container mx-auto justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <span className="text-primary">TrailBlazer</span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/dashboard/widgets" className="text-sm font-medium transition-colors hover:text-primary">
                        Widgets
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                    ) : user ? (
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
                                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.username}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500 focus:text-red-500">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button asChild>
                            <a href={LOGIN_URL}>
                                Login with Twitch
                            </a>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
