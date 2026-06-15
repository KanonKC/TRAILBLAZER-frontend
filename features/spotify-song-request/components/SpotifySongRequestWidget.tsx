"use client"

import { useSpotifySongRequest } from "../hooks/useSpotifySongRequest";
import { Skeleton } from "@/components/ui/skeleton";
import { Music2, ListMusic, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import WidgetOverviewCard from "@/components/widget/widget-tab-card/WidgetOverviewCard";
import WidgetQuickStartCard from "@/components/widget/widget-tab-card/WidgetQuickStartCard";
import { WidgetStepper } from "@/components/widget/WidgetStepper/WidgetStepper";
import WidgetStepperItems from "@/components/widget/WidgetStepper/WidgetStepperItems/WidgetStepperItems";
import WidgetEnabledBadge from "@/components/widget/WidgetEnabledBadge";
import WidgetSettingsCard from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCard";
import WidgetSettingsCardContent from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardContent";
import WidgetSettingsCardFooter from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardFooter";
import { TwitchRewardSelector } from "@/components/widget/TwitchRewardSelector";
import { BotProfileSelector } from "@/components/widget/BotProfileSelector";
import { ReplyMessageTextarea } from "@/components/widget/ReplyMessageTextarea";
import { SaveWidgetButton } from "@/components/button/SaveWidgetButton";
import { DeleteWidgetButton } from "@/components/button/DeleteWidgetButton";
import { WidgetConfigLayout } from "@/components/widget/layout/WidgetConfigLayout";
import { Label } from "@/components/ui/label";
import { SpotifySongRequestConfig } from "../types";
import { Spotify } from "@/components/icons/spotify";
import SubLabel from "@/components/SubLabel";

export function SpotifySongRequestWidget({ initialConfig }: { initialConfig: SpotifySongRequestConfig | null }) {
    const {
        user,
        config,
        isSaving,
        isUserLoading,
        activeTab,
        twitchRewardId,
        twitchBotId,
        invalidMessage,
        successMessage,
        noActiveMessage,
        setTwitchRewardId,
        setTwitchBotId,
        setInvalidMessage,
        setSuccessMessage,
        setNoActiveMessage,
        setActiveTab,
        handleEnable,
        handleSave,
        handleDelete,
    } = useSpotifySongRequest(initialConfig);

    if (isUserLoading) {
        return (
            <div className="container mx-auto py-10">
                <Skeleton className="h-[300px] w-full max-w-2xl mx-auto rounded-xl" />
            </div>
        );
    }

    // useEffect(() => {
    //     console.log("AAA", config)
    // }, [config])

    return (
        <WidgetConfigLayout
            title="Spotify Music Request"
            description="ให้ผู้ชมของคุณขอเพลง Spotify ผ่านการแลกแต้มช่อง บอทจะเพิ่มเพลงเข้าคิวและตอบกลับในแชท"
            icon={<Spotify className="w-6 h-6" />}
            iconClassName="bg-green-500/10 text-green-500"
        >
            {() => (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className={cn("grid w-full mb-4", config ? "grid-cols-3" : "grid-cols-1")}>
                        <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
                        {config && (
                            <>
                                <TabsTrigger value="quick-start" className="cursor-pointer">Quick Start</TabsTrigger>
                                <TabsTrigger value="settings" className="cursor-pointer">Settings</TabsTrigger>
                            </>
                        )}
                    </TabsList>

                    <TabsContent value="overview">
                        <WidgetOverviewCard
                            showLoginButton={!user}
                            showEnableButton={!!user && !config}
                            onClickEnable={handleEnable}
                            isLoading={isSaving}
                        >
                            <p className="text-gray-200 text-base leading-relaxed">
                                วิดเจ็ตนี้ช่วยให้ผู้ชมแลกแต้มช่องของคุณเพื่อขอเพลง Spotify บอทจะเพิ่มเพลงเข้าคิวอัตโนมัติและตอบกลับในแชท
                            </p>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                    <div className="p-2 w-fit rounded-lg bg-green-500/10 text-green-500 mb-3">
                                        <Music2 className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold mb-1">Song Request</h3>
                                    <p className="text-sm text-muted-foreground">ผู้ชมส่ง URL หรือชื่อเพลง Spotify เพื่อเพิ่มเข้าคิวเพลงของคุณได้ทันที</p>
                                </div>
                                <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                    <div className="p-2 w-fit rounded-lg bg-green-500/10 text-green-500 mb-3">
                                        <ListMusic className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold mb-1">Queue Management</h3>
                                    <p className="text-sm text-muted-foreground">บอทจัดการคิวเพลงและแจ้งในแชทเมื่อเพลงถูกเพิ่มเข้าคิวสำเร็จ</p>
                                </div>
                            </div>
                        </WidgetOverviewCard>
                    </TabsContent>

                    {config && (
                        <>
                            <TabsContent value="quick-start">
                                <WidgetQuickStartCard>
                                    <WidgetStepper>
                                        <WidgetStepperItems
                                            items={[
                                                {
                                                    step: 1,
                                                    title: "เปิดใช้งาน Widget",
                                                    description: <WidgetEnabledBadge />
                                                },
                                                {
                                                    step: 2,
                                                    title: "เลือกแต้มช่องที่ต้องการใช้งาน",
                                                    description: (
                                                        <div className="space-y-3">
                                                            <SubLabel>เลือก Channel Points Reward บน Twitch เพื่อใช้กับ Widget นี้</SubLabel>
                                                            <TwitchRewardSelector value={twitchRewardId} onValueChange={setTwitchRewardId} placeholder="เลือก Reward..." />
                                                        </div>
                                                    )
                                                },
                                                {
                                                    step: 3,
                                                    title: "โปรไฟล์บอทสำหรับส่งข้อความ",
                                                    description: (
                                                        <div className="space-y-3">
                                                            <SubLabel>เลือกบัญชีที่จะใช้ส่งข้อความทักทายไปยังห้องแชทของคุณ</SubLabel>
                                                            <BotProfileSelector hideLabel value={twitchBotId} onValueChange={setTwitchBotId} />
                                                        </div>
                                                    )
                                                },
                                                {
                                                    step: 4,
                                                    title: "บันทึกการตั้งค่า",
                                                    description: (
                                                        <div className="space-y-3">
                                                            <SubLabel>กดบันทึกเพื่อเริ่มใช้งาน Widget</SubLabel>
                                                            <SaveWidgetButton onSave={handleSave} isLoading={isSaving} />
                                                        </div>
                                                    )
                                                },
                                                {
                                                    step: 5,
                                                    title: <span className="flex items-center gap-2 spotify"><Spotify className="w-4 " /> เริ่มเปิดเพลงจากเพลยลิสต์ Spotify ของคุณ</span>,
                                                    description: (
                                                        <div className="space-y-3">
                                                            <SubLabel>การใส่เพลงเข้าคิวจะสามารถทำได้แค่เฉพาะตอนที่คุณกำลังเล่นเพลงบน Spotify เท่านั้น การใส่เพลงเข้าไปขณะที่ยังไม่ได้มีการเล่นเพลงจะทำให้การใส่เพลงนั้นล้มเหลว</SubLabel>
                                                        </div>
                                                    )
                                                }
                                            ]}
                                        />
                                    </WidgetStepper>
                                </WidgetQuickStartCard>
                            </TabsContent>

                            <TabsContent value="settings">
                                <WidgetSettingsCard>
                                    <WidgetSettingsCardContent>
                                        <div className="space-y-2">
                                            <Label>เลือกแต้มช่องที่ต้องการใช้งาน</Label>
                                            <SubLabel>เลือก Channel Points Reward บน Twitch เพื่อใช้กับ Widget นี้</SubLabel>
                                            <TwitchRewardSelector
                                                value={twitchRewardId}
                                                onValueChange={setTwitchRewardId}
                                            />
                                        </div>
                                        <BotProfileSelector
                                            value={twitchBotId}
                                            onValueChange={setTwitchBotId}
                                        />
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 border-b pb-2">
                                                <MessageSquare className="w-5 h-5 text-blue-500" />
                                                <h3 className="text-lg font-semibold">ข้อความตอบกลับ</h3>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>ข้อความเมื่อสำเร็จ</Label>
                                                <SubLabel>ข้อความที่จะตอบกลับผู้ใช้งาน เมื่อมีการใส่เพลงสำเร็จ</SubLabel>
                                                <ReplyMessageTextarea
                                                    value={successMessage}
                                                    onChange={setSuccessMessage}
                                                    placeholder="เพิ่ม {{track_name}} โดย {{track_artist}} เข้าคิวแล้ว!"
                                                    variables={[
                                                        { variable: "{{track_name}}", description: "ชื่อเพลง", example: "Blinding Lights" },
                                                        { variable: "{{track_artist}}", description: "ชื่อศิลปิน", example: "The Weeknd" },
                                                    ]}
                                                    rows={2}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>ข้อความเมื่อไม่พบเพลง</Label>
                                                <SubLabel>ข้อความที่จะตอบกลับผู้ใช้งาน เมื่อไม่พบเพลงหรือมีการทำงานผิดพลาด</SubLabel>
                                                <ReplyMessageTextarea
                                                    value={invalidMessage}
                                                    onChange={setInvalidMessage}
                                                    placeholder="ไม่พบเพลงที่ต้องการ กรุณาลองใหม่อีกครั้ง"
                                                    rows={2}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>ข้อความเมื่อไม่มีอุปกรณ์ที่กำลังเล่นอยู่</Label>
                                                <SubLabel>ข้อความที่จะตอบกลับผู้ใช้งาน เมื่อคุณยังไม่ได้เล่นเพลงบน Spotify</SubLabel>

                                                <ReplyMessageTextarea
                                                    value={noActiveMessage}
                                                    onChange={setNoActiveMessage}
                                                    placeholder="ลืมเปิดเครื่อง"
                                                    rows={2}
                                                />

                                                <SubLabel>* การใส่เพลงเข้าคิวจะสามารถทำได้แค่เฉพาะตอนที่คุณกำลังเล่นเพลงบน Spotify เท่านั้น การใส่เพลงเข้าไปขณะที่ยังไม่ได้มีการเล่นเพลงจะทำให้การใส่เพลงนั้นล้มเหลว</SubLabel>
                                            </div>
                                        </div>

                                    </WidgetSettingsCardContent>
                                    <WidgetSettingsCardFooter>
                                        <DeleteWidgetButton onDelete={handleDelete} isLoading={isSaving} />
                                        <SaveWidgetButton onSave={handleSave} isLoading={isSaving} />
                                    </WidgetSettingsCardFooter>
                                </WidgetSettingsCard>
                            </TabsContent>
                        </>
                    )}
                </Tabs>
            )}
        </WidgetConfigLayout>
    );
}
