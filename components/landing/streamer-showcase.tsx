"use client";

import Image from "next/image";
import { useMemo } from "react";


export interface ShowcaseItem {
    display_name: string;
    username: string;
    avatar_url: string;
}

interface StreamerShowcaseProps {
    streamers?: ShowcaseItem[];
}

export function StreamerShowcase({ streamers }: StreamerShowcaseProps) {

    const data = useMemo(() => (
        streamers && streamers.length > 0
            ? streamers.map(s => ({
                name: s.display_name,
                image: s.avatar_url,
                link: `https://twitch.tv/${s.username}`
            }))
            : []
    ), [streamers]);

    // Duplicate the list exactly once to create a seamless circular loop with translateX(-50%)
    const displayStreamers = useMemo(() => ([...data, ...data]), [data]);

    return (
        <section className="py-20 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 mb-12 text-center relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                    ไว้วางใจโดย <span className="trailblazer-gradient-text">สตรีมเมอร์</span> เหล่านี้
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    ทำความรู้จักกับเหล่าสตรีมเมอร์ที่เลือกใช้ TRAILBLAZER เพื่อช่วยจัดการระบบสตรีมเบื้องหลังให้เป็นเรื่องง่ายและสะดวกสบาย
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
