import { Twitch } from "@/components/icons/twitch";
import { YouTube } from "@/components/icons/youtube";
import { Discord } from "@/components/icons/discord";
import { Spotify } from "@/components/icons/spotify";

export interface PlatformConfig {
    key: string;
    name: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
    bgGradient: string;
    canUnbind: boolean;
    isActive: boolean;
}

export const Platforms = {
    Twitch: {
        key: "twitch",
        name: "Twitch",
        icon: Twitch,
        color: "#9146FF",
        bgGradient: "from-[#9146FF]/20 to-[#6441A5]/10",
        canUnbind: false,
        isActive: true,
    },
    YouTube: {
        key: "youtube",
        name: "YouTube",
        icon: YouTube,
        color: "#FF0000",
        bgGradient: "from-[#FF0000]/20 to-[#CC0000]/10",
        canUnbind: true,
        isActive: false,
    },
    Discord: {
        key: "discord",
        name: "Discord",
        icon: Discord,
        color: "#5865F2",
        bgGradient: "from-[#5865F2]/20 to-[#4752C4]/10",
        canUnbind: true,
        isActive: true,
    },
    Spotify: {
        key: "spotify",
        name: "Spotify",
        icon: Spotify,
        color: "#1DB954",
        bgGradient: "from-[#1DB954]/20 to-[#191414]/10",
        canUnbind: true,
        isActive: true,
    },
};