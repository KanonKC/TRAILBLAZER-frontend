"use client"

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TwitchLoginButton } from "@/components/button/TwitchLoginButton";
import { BrandLogo } from "@/components/brand-logo";
import LightPillar from "@/components/fancy/light-pillar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift } from "lucide-react";
import { useUser } from "@/components/user-context";
import { useEffect, useState } from "react";

const DEFAULT_TOP_COLOR = "#FFD700";
const DEFAULT_BOTTOM_COLOR = "#FF8C00";
const HOVER_TOP_COLOR = "#8400ff";
const HOVER_BOTTOM_COLOR = "#ce00ff";

function LoginContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, isLoading } = useUser();
    const ref = searchParams.get("ref");
    const [isHoveringLogin, setIsHoveringLogin] = useState(false);
    const [sectionHeight, setSectionHeight] = useState<number | null>(null);

    useEffect(() => {
        if (!isLoading && user) {
            router.replace("/dashboard/widgets");
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        const updateHeight = () => {
            const navbar = document.querySelector("nav");
            const footer = document.querySelector("footer");
            const navbarHeight = navbar?.getBoundingClientRect().height ?? 0;
            const footerHeight = footer?.getBoundingClientRect().height ?? 0;
            setSectionHeight(window.innerHeight - navbarHeight - footerHeight);
        };

        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    if (isLoading || user) {
        return <div className="min-h-screen flex items-center justify-center">กำลังโหลด...</div>;
    }

    return (
        <section
            className="relative flex items-center justify-center overflow-hidden p-4"
            style={{ height: sectionHeight !== null ? `${sectionHeight}px` : "100vh" }}
        >
            <LightPillar
                topColor={isHoveringLogin ? HOVER_TOP_COLOR : DEFAULT_TOP_COLOR}
                bottomColor={isHoveringLogin ? HOVER_BOTTOM_COLOR : DEFAULT_BOTTOM_COLOR}
                intensity={2}
                rotationSpeed={2}
                glowAmount={0.002}
                pillarWidth={1}
                pillarHeight={0.1}
                noiseIntensity={0.2}
                pillarRotation={25}
                interactive={false}
                mixBlendMode="normal"
                quality="low"
                className="opacity-80"
            />

            <div className="relative z-10 w-full max-w-md max-h-full overflow-y-auto animate-in fade-in zoom-in duration-500">
                <Card className="border-primary/20 shadow-2xl">
                    <CardHeader className="text-center space-y-2 sm:space-y-4">
                        <div className="flex justify-center mb-1 sm:mb-2">
                            <BrandLogo />
                        </div>
                        <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">ยินดีต้อนรับสู่ TRAILBLAZER</CardTitle>
                        <CardDescription className="text-sm sm:text-base text-muted-foreground">
                            เชื่อมต่อบัญชี Twitch ของคุณเพื่อเริ่มยกระดับการสตรีม
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                        {ref && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm animate-pulse-glow">
                                <Gift className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-primary">ตรวจพบโบนัสจากการแนะนำเพื่อน!</p>
                                    <p className="text-muted-foreground">สมัครใช้งานตอนนี้เพื่อรับ <span className="font-bold text-white">โควตา Widget เพิ่มอีก +1</span> เป็นของขวัญต้อนรับ</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <TwitchLoginButton
                                className="w-full h-12 text-lg font-bold shadow-lg shadow-purple-500/20"
                                onMouseEnter={() => setIsHoveringLogin(true)}
                                onMouseLeave={() => setIsHoveringLogin(false)}
                            />
                            <p className="text-xs text-center text-muted-foreground px-4">
                                การเข้าสู่ระบบแสดงว่าคุณยอมรับ <a href="/terms-of-service" className="underline cursor-pointer">ข้อกำหนดการให้บริการ</a> และ <a href="/privacy-policy" className="underline cursor-pointer">นโยบายความเป็นส่วนตัว</a> ของเรา
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Subtle bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </section>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">กำลังโหลด...</div>}>
            <LoginContent />
        </Suspense>
    );
}
