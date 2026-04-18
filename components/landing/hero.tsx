"use client";

import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";
import Link from "next/link";
import LightPillar from "@/components/fancy/light-pillar";
import { BrandLogo } from "@/components/brand-logo";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated background */}
            {/* Animated background - Light Pillar */}
            <LightPillar
                topColor="#FFD700"
                bottomColor="#FF8C00"
                intensity={1}
                rotationSpeed={0.7}
                glowAmount={0.002}
                pillarWidth={5}
                pillarHeight={0.4}
                noiseIntensity={0.5}
                pillarRotation={25}
                interactive={false}
                mixBlendMode="screen"
                quality="high"
                className="opacity-80"
            />
            {/* Overlay gradient to ensure text readability if needed */}
            <div className="absolute inset-0 bg-background/30 -z-5" />

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                {/* Logo/Icon */}
                {/* <div className="flex justify-center mb-8">
                    <div className="p-4 rounded-2xl glass animate-pulse-glow">
                        <Flame className="w-16 h-16 text-primary" />
                    </div>
                </div> */}

                {/* Main heading */}
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                    <BrandLogo />
                </h1>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl mb-4 max-w-2xl mx-auto">
                    แพลตฟอร์มเชื่อมต่อ Twitch ของคุณ
                </p>
                <p className="text-lg mb-10 max-w-xl mx-auto">
                    เชื่อมต่อ ปรับปรุง และเสริมพลังประสบการณ์การสตรีมของคุณด้วยเครื่องมือที่ทรงพลังและการเชื่อมต่อที่ราบรื่น
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/dashboard/widgets">
                        <Button
                            size="lg"
                            className="trailblazer-gradient text-white font-semibold px-8 py-6 text-lg hover:opacity-90 transition-opacity"
                        >
                            เริ่มต้นใช้งาน
                        </Button>
                    </Link>
                    <a href="https://discord.gg/aH4X6PJ3kt" target="_blank" rel="noopener noreferrer">
                        <Button
                            size="lg"
                            variant="outline"
                            className="glass border-primary/30 hover:bg-primary/10 px-8 py-6 text-lg"
                        >
                            เข้าร่วม Discord
                        </Button>
                    </a>
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </section>
    );
}
