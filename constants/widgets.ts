import { YouTube } from "@/components/icons/youtube";
import { Dices, ImageIcon, MessageSquare, Music, Video } from "lucide-react";

export const StaticWidgets = [
    {
        slug: "first-word",
        title: "Greeting Message",
        description: "ตอบกลับผู้ใช้งานที่แชทเข้ามาครั้งแรกในสตรีมของคุณโดยอัตโนมัติ",
        icon: MessageSquare,
        href: "/dashboard/widgets/first-word",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20"
    },
    {
        slug: "clip-shoutout",
        title: "Clip Shoutout",
        description: "โปรโมทเพื่อนสตรีมเมอร์ที่มา Raid ด้วยการโชว์คลิปล่าสุดของอัตโนมัติ",
        icon: Video,
        href: "/dashboard/widgets/clip-shoutout",
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20"
    },
    {
        slug: "random-dbd-perk",
        title: "Random DBD Perk",
        description: "สุ่ม Perk Dead by Daylight สำหรับ Survivor และ Killer ผ่านการแลกแต้มช่อง หรือคำสั่งแชท",
        icon: Dices,
        href: "/dashboard/widgets/random-dbd-perk",
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20"
    },
    {
        slug: "drop-image",
        title: "Drop Image",
        description: "ให้ผู้ชมของคุณโชว์รูปภาพบนหน้าจอผ่านการแลกแต้มช่อง",
        icon: ImageIcon,
        href: "/dashboard/widgets/drop-image",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20"
    },
    {
        slug: "spotify-song-request",
        title: "Spotify Song Request",
        description: "ให้ผู้ชมของคุณขอเพลง Spotify ผ่านการแลกแต้มช่อง บอทจะเพิ่มเพลงเข้าคิวและตอบกลับในแชท",
        icon: Music,
        href: "/dashboard/widgets/spotify-song-request",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20"
    },
    {
        slug: "export-video",
        title: "Auto Export to YouTube",
        description: "ส่งออกวิดีโอ (VOD) จาก Twitch ไปยัง YouTube โดยอัตโนมัติเมื่อคุณสตรีมจบ",
        icon: YouTube,
        href: "/dashboard/widgets/export-video",
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20"
    }
];