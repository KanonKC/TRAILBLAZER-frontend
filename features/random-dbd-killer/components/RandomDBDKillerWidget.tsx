"use client"

import { useRandomDBDKiller } from "../hooks/useRandomDBDKiller";
import { Skeleton } from "@/components/ui/skeleton";
import { Skull, Gift, ShieldQuestion } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

import WidgetOverviewCard from "@/components/widget/widget-tab-card/WidgetOverviewCard";
import WidgetQuickStartCard from "@/components/widget/widget-tab-card/WidgetQuickStartCard";
import { WidgetStepper } from "@/components/widget/WidgetStepper/WidgetStepper";
import WidgetStepperItems from "@/components/widget/WidgetStepper/WidgetStepperItems/WidgetStepperItems";
import WidgetEnabledBadge from "@/components/widget/WidgetEnabledBadge";
import { DeleteWidgetButton } from "@/components/button/DeleteWidgetButton";
import WidgetSettingsCard from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCard";
import WidgetSettingsCardContent from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardContent";
import WidgetSettingsCardFooter from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardFooter";
import { TwitchRewardSelector } from "@/components/widget/TwitchRewardSelector";
import { SmartOverlayUrlInput } from "@/components/widget/SmartOverlayUrlInput";
import { OBSSetupHelp } from "@/components/widget/OBSSetupHelp";
import { WidgetTestControl } from "@/components/widget/WidgetTestControl";
import SubLabel from "@/components/SubLabel";
import { WidgetConfigLayout } from "@/components/widget/layout/WidgetConfigLayout";
import { KillerPoolSelector } from "./KillerPoolSelector";
import { AnimationStyleSelect } from "./AnimationStyleSelect";
import { RandomDBDKillerConfig } from "../types";

export function RandomDBDKillerWidget({ initialConfig }: { initialConfig: RandomDBDKillerConfig | null }) {
    const {
        user,
        config,
        isEnabled,
        isSaving,
        isTesting,
        isUserLoading,
        activeTab,
        twitchRewardId,
        killerPool,
        animationStyle,
        killerMasters,
        isLoadingKillerMasters,
        overlayUrl,
        setTwitchRewardId,
        setAnimationStyle,
        toggleKiller,
        setActiveTab,
        setConfig,
        handleEnable,
        handleDelete,
        handleSave,
        handleTest,
        handleStatusChange
    } = useRandomDBDKiller(initialConfig);

    if (isUserLoading) {
        return (
            <div className="container mx-auto py-10">
                <Skeleton className="h-[300px] w-full max-w-2xl mx-auto rounded-xl" />
            </div>
        )
    }

    return (
        <WidgetConfigLayout
            title="Random DBD Killer"
            description="สุ่มตัว Killer จาก Dead by Daylight ที่คุณกำหนดไว้ ผ่านการแลกแต้มช่อง"
            icon={<Skull className="w-6 h-6" />}
            iconClassName="bg-red-500/10 text-red-500"
        >
            {({ triggerRefresh, refreshKey }) => (
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
                            onClickEnable={async () => {
                                await handleEnable();
                                triggerRefresh();
                            }}
                            isLoading={isSaving}
                        >
                            <p className="text-gray-200 text-base leading-relaxed">
                                วิดเจ็ตนี้ช่วยให้ผู้ชมแลกแต้มช่องของคุณเพื่อสุ่มตัว Killer จาก Dead by Daylight ที่คุณเลือกไว้ล่วงหน้า แล้วแสดงผลลัพธ์บนหน้าจอสตรีมทันที
                            </p>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                    <div className="p-2 w-fit rounded-lg bg-red-500/10 text-red-500 mb-3">
                                        <Gift className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold mb-1">Channel Points</h3>
                                    <p className="text-sm text-muted-foreground">เชื่อมต่อกับแต้มช่องของ Twitch เพื่อสุ่ม Killer ทันทีที่มีการแลกแต้ม</p>
                                </div>
                                <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                    <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-500 mb-3">
                                        <ShieldQuestion className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold mb-1">กำหนด Killer Pool เอง</h3>
                                    <p className="text-sm text-muted-foreground">เลือกได้ว่าจะให้สุ่มจาก Killer ตัวไหนบ้าง</p>
                                </div>
                            </div>
                        </WidgetOverviewCard>
                    </TabsContent>

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
                                                    <p className="text-sm text-white/70">เลือก Channel Points Reward บน Twitch เพื่อใช้กับ Widget นี้</p>
                                                    <TwitchRewardSelector value={twitchRewardId} onValueChange={setTwitchRewardId} placeholder="เลือก Reward..." userInputRequired={false} />
                                                </div>
                                            )
                                        },
                                        {
                                            step: 3,
                                            title: "เลือก Killer ที่ต้องการให้สุ่ม",
                                            description: (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-white/70">เลือก Killer อย่างน้อยหนึ่งตัวเพื่อให้ระบบสุ่มได้</p>
                                                    <KillerPoolSelector
                                                        killerMasters={killerMasters}
                                                        killerPool={killerPool}
                                                        onToggle={toggleKiller}
                                                        isLoading={isLoadingKillerMasters}
                                                    />
                                                </div>
                                            )
                                        },
                                        {
                                            step: 4,
                                            title: "นำ Overlay ไปใส่ใน OBS",
                                            description: (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-white/70">นำ URL นี้ไปใส่ใน Browser Source ของ OBS</p>
                                                    <SmartOverlayUrlInput
                                                        url={overlayUrl}
                                                        slug="random-dbd-killer"
                                                        onSuccess={setConfig}
                                                        hideLabel
                                                    />
                                                    <OBSSetupHelp type="image" defaultOpen />
                                                </div>
                                            )
                                        },
                                        {
                                            step: 5,
                                            title: "บันทึกและทดสอบ",
                                            description: (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-white/70">กดบันทึกและทดสอบ ลองกดปุ่ม Test ด้านล่าง</p>
                                                    <WidgetTestControl isSaving={isSaving} isTesting={isTesting} onSave={handleSave} onTest={handleTest} canTest={!!twitchRewardId && killerPool.length > 0} />
                                                </div>
                                            )
                                        }
                                    ]}
                                />
                            </WidgetStepper>
                        </WidgetQuickStartCard>
                    </TabsContent>

                    <TabsContent value="settings">
                        <WidgetSettingsCard
                            widgetId={config?.widget?.id}
                            isEnabled={isEnabled}
                            cost={config?.widget?.widget_type?.cost}
                            onStatusChange={handleStatusChange}
                            onSuccess={triggerRefresh}
                        >
                            <WidgetSettingsCardContent>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>เชื่อมต่อแต้มช่องบน Twitch</Label>
                                        <SubLabel>เลือก Channel Points Reward บน Twitch เพื่อใช้กับ Widget นี้</SubLabel>
                                        <TwitchRewardSelector value={twitchRewardId} onValueChange={setTwitchRewardId} placeholder="เลือก Reward..." />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Killer Pool</Label>
                                        <SubLabel>เลือก Killer ที่ต้องการให้ระบบสุ่ม</SubLabel>
                                        <KillerPoolSelector
                                            killerMasters={killerMasters}
                                            killerPool={killerPool}
                                            onToggle={toggleKiller}
                                            isLoading={isLoadingKillerMasters}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>รูปแบบ Animation ตอนสุ่ม</Label>
                                        <SubLabel>เลือกรูปแบบการแสดงผลตอนสุ่ม Killer บนหน้า Overlay</SubLabel>
                                        <AnimationStyleSelect value={animationStyle} onValueChange={setAnimationStyle} />
                                    </div>

                                    <SmartOverlayUrlInput
                                        url={overlayUrl}
                                        slug="random-dbd-killer"
                                        onSuccess={setConfig}
                                    />
                                </div>
                            </WidgetSettingsCardContent>
                            <WidgetSettingsCardFooter>
                                <DeleteWidgetButton onDelete={handleDelete} isLoading={isSaving} />
                                <WidgetTestControl isSaving={isSaving} isTesting={isTesting} onSave={handleSave} onTest={handleTest} canTest={!!twitchRewardId && killerPool.length > 0} />
                            </WidgetSettingsCardFooter>
                        </WidgetSettingsCard>
                    </TabsContent>
                </Tabs>
            )}
        </WidgetConfigLayout>
    );
}
