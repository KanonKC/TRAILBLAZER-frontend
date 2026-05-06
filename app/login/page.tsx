"use client"

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TwitchLoginButton } from "@/components/button/TwitchLoginButton";
import { BrandLogo } from "@/components/brand-logo";
import LightPillar from "@/components/fancy/light-pillar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift } from "lucide-react";
import { useUser } from "@/components/user-context";
import { useEffect } from "react";

function LoginContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, isLoading } = useUser();
    const ref = searchParams.get("ref");

    useEffect(() => {
        if (!isLoading && user) {
            router.replace("/dashboard/widgets");
        }
    }, [user, isLoading, router]);

    if (isLoading || user) {
        return <div className="min-h-screen flex items-center justify-center">กำลังโหลด...</div>;
    }

    return (
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden p-4">
            <LightPillar
                topColor="#FFD700"
                bottomColor="#FF8C00"
                intensity={0.8}
                rotationSpeed={0.5}
                glowAmount={0.002}
                pillarWidth={4}
                pillarHeight={0.3}
                noiseIntensity={0.5}
                pillarRotation={25}
                interactive={false}
                mixBlendMode="screen"
                quality="high"
                className="opacity-50"
            />

            <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
                <Card className="glass border-primary/20 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="text-center space-y-4">
                        <div className="flex justify-center mb-2">
                            <BrandLogo />
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight">ยินดีต้อนรับสู่ TRAILBLAZER</CardTitle>
                        <CardDescription className="text-base text-muted-foreground">
                            เชื่อมต่อบัญชี Twitch ของคุณเพื่อเริ่มยกระดับการสตรีม
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
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
                            <TwitchLoginButton className="w-full h-12 text-lg font-bold shadow-lg shadow-purple-500/20" />
                            <p className="text-xs text-center text-muted-foreground px-4">
                                การเข้าสู่ระบบแสดงว่าคุณยอมรับ <span className="underline cursor-pointer">ข้อกำหนดการให้บริการ</span> และ <span className="underline cursor-pointer">นโยบายความเป็นส่วนตัว</span> ของเรา
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