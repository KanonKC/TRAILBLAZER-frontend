import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Shield, Users, BarChart3, Bell, Plug } from "lucide-react";

const features = [
    {
        icon: Zap,
        title: "รวดเร็วทันใจ",
        description: "การเชื่อมต่อแบบเรียลไทม์พร้อมการตอบสนองทันทีสำหรับอีเวนต์ Twitch ของคุณ",
    },
    {
        icon: Shield,
        title: "ปลอดภัย & เชื่อถือได้",
        description: "ความปลอดภัยระดับองค์กรด้วย OAuth 2.0 และการเข้ารหัสข้อมูล",
    },
    {
        icon: Users,
        title: "เครื่องมือชุมชน",
        description: "มีส่วนร่วมกับผู้ชมด้วยฟีเจอร์การจัดการและโต้ตอบที่ทรงพลัง",
    },
    {
        icon: BarChart3,
        title: "แดชบอร์ดวิเคราะห์",
        description: "ติดตามการเติบโตของคุณด้วยข้อมูลเชิงลึกและตัวชี้วัดประสิทธิภาพ",
    },
    {
        icon: Bell,
        title: "การแจ้งเตือนอัจฉริยะ",
        description: "การแจ้งเตือนที่ปรับแต่งได้สำหรับ follows, subs, raids และอื่นๆ",
    },
    {
        icon: Plug,
        title: "เชื่อมต่อง่าย",
        description: "เชื่อมต่อเครื่องมือที่คุณชื่นชอบด้วย API และ webhooks ที่ใช้ง่าย",
    },
];

export function Features() {
    return (
        <section className="py-24 px-4 relative">
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        ทุกสิ่งที่คุณต้องการเพื่อ{" "}
                        <span className="blaze-gradient-text">ยกระดับ</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        ฟีเจอร์ที่ทรงพลังออกแบบมาเพื่อเสริมประสิทธิภาพการสตรีมและขยายชุมชนของคุณ
                    </p>
                </div>

                {/* Feature grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="glass border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1"
                        >
                            <CardHeader>
                                <div className="w-12 h-12 rounded-xl blaze-gradient flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
