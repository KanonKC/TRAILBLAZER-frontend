"use client";

import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 trailblazer-gradient animate-gradient opacity-20" />

            {/* Floating orbs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full trailblazer-gradient opacity-30 blur-3xl animate-float" />
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full trailblazer-gradient opacity-20 blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                {/* Logo/Icon */}
                <div className="flex justify-center mb-8">
                    <div className="p-4 rounded-2xl glass animate-pulse-glow">
                        <Flame className="w-16 h-16 text-purple-400" />
                    </div>
                </div>

                {/* Main heading */}
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                    <span className="trailblazer-gradient-text">TRAILBLAZER</span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
                    แพลตฟอร์มเชื่อมต่อ Twitch ของคุณ
                </p>
                <p className="text-lg text-muted-foreground/70 mb-10 max-w-xl mx-auto">
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
                    <Button
                        size="lg"
                        variant="outline"
                        className="glass border-purple-500/30 hover:bg-purple-500/10 px-8 py-6 text-lg"
                    >
                        เรียนรู้เพิ่มเติม
                    </Button>
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </section>
    );
}
