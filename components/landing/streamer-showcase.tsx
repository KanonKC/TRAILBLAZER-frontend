"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";

const MOCK_STREAMERS = [
    {
        name: "KanonKC",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/3885c66b-2f80-4979-a6a4-d146c91bc7c8-profile_image-300x300.png",
        link: "https://twitch.tv/kanonkc",
    },
    {
        name: "MrJeremyBot",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/e0bdb40f-d002-4ca0-ac86-937867b93851-profile_image-300x300.png",
        link: "https://twitch.tv/mrjeremybot",
    },
    {
        name: "Makeyourchoice191",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/46f20b72-d64d-44fb-8430-e67d2712ddcc-profile_image-300x300.png",
        link: "https://twitch.tv/makeyourchoice191",
    },
    {
        name: "CHAINHUCKER",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/a0a0575a-c435-46e8-b704-21f035da12c0-profile_image-300x300.png",
        link: "https://twitch.tv/chainhucker",
    },
    {
        name: "TLeader_Style",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/c1ab7a84-a6b1-49e4-98ec-dae676e8b0ea-profile_image-300x300.png",
        link: "https://twitch.tv/tleader_style",
    },
    {
        name: "bananajunggg",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/6e0fb2bc-7323-4ed4-86a5-b3c3057b363c-profile_image-300x300.png",
        link: "https://twitch.tv/bananajunggg",
    },
    {
        name: "Tylive_TTV",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/d2d64508-963e-47d9-bd5b-37c8c32be096-profile_image-300x300.png",
        link: "https://twitch.tv/tylive_ttv",
    },
    {
        name: "tungmhe",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/6b8586bb-495f-4382-ac3b-4163dfa6fe96-profile_image-300x300.png",
        link: "https://twitch.tv/tungmhe",
    },
    {
        name: "TamaKungCH",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/b234ebb1-4d52-431a-80b2-85c8e692e14f-profile_image-300x300.png",
        link: "https://twitch.tv/tamakungch",
    },
    {
        name: "ItzSUNSHINEx",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/1d534c2f-dfcc-4f85-b02e-3103e936bcaa-profile_image-300x300.png",
        link: "https://twitch.tv/itzsunshinex",
    },
    {
        name: "AlucardWalkerr",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/786a658e-e0ca-483e-8846-eef5ae77878c-profile_image-300x300.png",
        link: "https://twitch.tv/alucardwalkerr",
    },
    {
        name: "KaxliaXIV",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/5316144d-e5ba-46ff-9c87-0043b3235280-profile_image-300x300.png",
        link: "https://twitch.tv/kaxliaxiv",
    },
    {
        name: "lachi464",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/cebaa1c0-f138-4709-b9f1-c7be0b97023f-profile_image-300x300.png",
        link: "https://twitch.tv/lachi464",
    },
    {
        name: "porJunGz",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/6ee14748-1009-4470-96da-d359350b702f-profile_image-300x300.png",
        link: "https://twitch.tv/porjungz",
    },
    {
        name: "diamonxv",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/7987b39d-849a-45fa-af27-c67f618c75f5-profile_image-300x300.png",
        link: "https://twitch.tv/diamonxv",
    },
    {
        name: "Owlreggae",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/ca8cd6ae-170a-4fb5-ac4a-b3c29b9c1c0c-profile_image-300x300.png",
        link: "https://twitch.tv/owlreggae",
    },
    {
        name: "Jaymajam",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/d270486a-f036-487c-a319-2ca01e71a5b0-profile_image-300x300.png",
        link: "https://twitch.tv/jaymajam",
    },
    {
        name: "im_real_sleep",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/8d16d103-b1da-4259-8435-5c5a4bc7275b-profile_image-300x300.png",
        link: "https://twitch.tv/im_real_sleep",
    },
    {
        name: "mumupeachu",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/817c4d9f-3c87-458d-b2e1-a2c7d4b4747d-profile_image-300x300.png",
        link: "https://twitch.tv/mumupeachu",
    },
    {
        name: "Jayjay_Salmon",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/dcef0888-ca7d-4340-9535-10a6485a1ea3-profile_image-300x300.png",
        link: "https://twitch.tv/jayjay_salmon",
    },
    {
        name: "SIXT33Nx",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/f2dd4e3a-d332-44cf-b16f-595d2b0d241c-profile_image-300x300.png",
        link: "https://twitch.tv/sixt33nx",
    },
    {
        name: "PonzuTheSkeleton",
        image: "https://static-cdn.jtvnw.net/jtv_user_pictures/3b78fc36-b8f9-4486-98e4-6df8156ed07a-profile_image-300x300.png",
        link: "https://twitch.tv/ponzutheskeleton",
    },
];

export function StreamerShowcase() {
    // Duplicate the list exactly once to create a seamless circular loop with translateX(-50%)
    const displayStreamers = [...MOCK_STREAMERS, ...MOCK_STREAMERS];

    return (
        <section className="py-20 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 mb-12 text-center relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                    ไว้วางใจโดย <span className="trailblazer-gradient-text">สตรีมเมอร์</span> ชั้นนำ
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    เข้าร่วมกับสตรีมเมอร์ที่กำลังใช้งาน TRAILBLAZER เพื่อยกระดับประสบการณ์การสตรีมของพวกเขา
                </p>
            </div>

            <div className="relative group">
                {/* Gradient fades for the edges */}
                <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div className="flex animate-marquee py-4">
                    {displayStreamers.map((streamer, index) => (
                        <a
                            key={`${streamer.name}-${index}`}
                            href={streamer.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 mx-4"
                        >
                            <div className="glass group/card relative p-1 rounded-full transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-primary">
                                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-primary/20">
                                    <Image
                                        src={streamer.image}
                                        alt={streamer.name}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                                        {/* <ExternalLink className="w-8 h-8 text-white" /> */}
                                    </div>
                                </div>

                                {/* Name badge */}
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-card border border-border px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover/card:opacity-100 transition-opacity shadow-lg whitespace-nowrap">
                                    <span className="trailblazer-gradient-text">{streamer.name}</span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
