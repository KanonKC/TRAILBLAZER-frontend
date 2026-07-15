"use client"

import { useDropImage } from "../hooks/useDropImage";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ImageIcon,
    Gift,
    ShieldCheck,
    Play
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

import WidgetOverviewCard from "@/components/widget/widget-tab-card/WidgetOverviewCard";
import WidgetQuickStartCard from "@/components/widget/widget-tab-card/WidgetQuickStartCard";
import { WidgetStepper } from "@/components/widget/WidgetStepper/WidgetStepper";
import WidgetStepperItems from "@/components/widget/WidgetStepper/WidgetStepperItems/WidgetStepperItems";
import WidgetEnabledBadge from "@/components/widget/WidgetEnabledBadge";
import { SaveWidgetButton } from "@/components/button/SaveWidgetButton";
import { DeleteWidgetButton } from "@/components/button/DeleteWidgetButton";
import WidgetSettingsCard from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCard";
import WidgetSettingsCardContent from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardContent";
import WidgetSettingsCardFooter from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardFooter";
import { TwitchRewardSelector } from "@/components/widget/TwitchRewardSelector";
import { SmartOverlayUrlInput } from "@/components/widget/SmartOverlayUrlInput";
import { OBSSetupHelp } from "@/components/widget/OBSSetupHelp";
import { WidgetTestControl } from "@/components/widget/WidgetTestControl";
import { BotProfileSelector } from "@/components/widget/BotProfileSelector";
import { ReplyMessageTextarea } from "@/components/widget/ReplyMessageTextarea";
import { DropImageConfig } from "../types";
import { WidgetConfigLayout } from "@/components/widget/layout/WidgetConfigLayout";
import SubLabel from "@/components/SubLabel";
import { WidgetTypeMeta } from "@/services/widget.service";

export function DropImageWidget({ initialConfig, widgetType }: { initialConfig: DropImageConfig | null; widgetType: WidgetTypeMeta }) {
    const {
        user,
        config,
        isEnabled,
        isSaving,
        isTesting,
        isUserLoading,
        activeTab,
        twitchRewardId,
        displayDuration,
        enabledModeration,
        botProfile,
        invalidMessage,
        notImageMessage,
        containMatureMessage,
        overlayUrl,
        setTwitchRewardId,
        setDisplayDuration,
        setEnabledModeration,
        setBotProfile,
        setInvalidMessage,
        setNotImageMessage,
        setContainMatureMessage,
        setActiveTab,
        setConfig,
        handleEnable,
        handleDelete,
        handleSave,
        handleTest,
        handleStatusChange
    } = useDropImage(initialConfig);

    if (isUserLoading) {
        return (
            <div className="container mx-auto py-10">
                <Skeleton className="h-[300px] w-full max-w-2xl mx-auto rounded-xl" />
            </div>
        )
    }

    return (
        <WidgetConfigLayout widgetType={widgetType}>
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
                                วิดเจ็ตนี้ช่วยให้ผู้ชมแลกแต้มช่องของคุณและส่ง URL ของรูปภาพ โดยมีระบบตรวจสอบความถูกต้องและคัดกรองเนื้อหาที่ไม่เหมาะสม ก่อนปล่อยตกบนสตรีม
                            </p>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                    <div className="p-2 w-fit rounded-lg bg-purple-500/10 text-purple-500 mb-3">
                                        <Gift className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold mb-1">Channel Points</h3>
                                    <p className="text-sm text-muted-foreground">เชื่อมต่อกับแต้มช่องของ Twitch และรับ URL ของภาพจากผู้ใช้ได้อย่างสะดวก</p>
                                </div>
                                <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                    <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-500 mb-3">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold mb-1">Image Moderation</h3>
                                    <p className="text-sm text-muted-foreground">AI คอยคัดกรองรูปภาพก่อนแสดงผลเสมอ ป้องกันเนื้อหาที่ไม่เหมาะสม</p>
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
                                            title: `เลือกแต้มช่องที่ต้องการใช้งาน`,
                                            description: (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-white/70">เลือก Channel Points Reward บน Twitch เพื่อใช้กับ Widget นี้</p>
                                                    <TwitchRewardSelector value={twitchRewardId} onValueChange={setTwitchRewardId} placeholder="เลือก Reward..." />
                                                </div>
                                            )
                                        },
                                        {
                                            step: 3,
                                            title: "ตั้งค่าระยะเวลาการแสดงผล",
                                            description: (
                                                <div className="space-y-4">
                                                    <p className="text-sm text-muted-foreground">ตั้งเวลาให้รูปภาพแสดงค้างไว้กี่วินาที</p>
                                                    <div className="flex items-center gap-3">
                                                        <Slider value={[displayDuration]} onValueChange={([v]) => setDisplayDuration(v)} min={1} max={20} className="flex-1" />
                                                        <span className="text-sm tabular-nums w-16 text-right text-muted-foreground">{displayDuration} วินาที</span>
                                                    </div>
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
                                                        slug="drop-image"
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
                                                    <WidgetTestControl isSaving={isSaving} isTesting={isTesting} onSave={handleSave} onTest={handleTest} canTest={!!twitchRewardId} />
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
                                        <SubLabel>เลือกแต้มช่องที่ต้องการใช้งานกับ Widget นี้ หากคุณไม่เห็นแต้มช่องตรงนี้ ลองเช็คให้มั่นใจว่าคุณได้สร้างแต้มช่องแบบที่ให้คนดูกรอกข้อมูลได้แล้ว</SubLabel>
                                        <TwitchRewardSelector value={twitchRewardId} onValueChange={setTwitchRewardId} placeholder="เลือก Reward..." />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>ระยะเวลาการแสดงผลรูปภาพ (วินาที)</Label>
                                        <div className="flex items-center gap-3">
                                            <Slider value={[displayDuration]} onValueChange={([v]) => setDisplayDuration(v)} min={1} max={20} className="flex-1" />
                                            <span className="text-sm tabular-nums w-16 text-right text-muted-foreground">{displayDuration} วินาที</span>
                                        </div>
                                    </div>

                                    <SmartOverlayUrlInput
                                        url={overlayUrl}
                                        slug="drop-image"
                                        onSuccess={setConfig}
                                    />

                                    {/* Content Moderation */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 border-b pb-2">
                                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                            <h3 className="text-lg font-semibold">Content Moderation</h3>
                                        </div>
                                        <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                            <div className="space-y-2 mr-2">
                                                <Label>เปิดใช้งานการตรวจสอบเนื้อหาด้วย<a href="https://sightengine.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">Sightengine</a></Label>
                                                <p className="text-sm text-muted-foreground">
                                                    หากเปิดใช้งาน จะทำการตรวจสอบรูปภาพที่ส่งมาว่ามีเนื้อหาไม่เหมาะสมหรือไม่ (NSFW / Gore) และป้องกันการแสดงรูปภาพเหล่านั้นขึ้นบนหน้าจอ
                                                </p>
                                            </div>
                                            <Switch
                                                checked={enabledModeration}
                                                onCheckedChange={setEnabledModeration}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <BotProfileSelector value={botProfile} onValueChange={setBotProfile} />
                                        <div className="space-y-2"><Label>ข้อความเมื่อ URL ไม่ถูกต้อง</Label><ReplyMessageTextarea value={invalidMessage} onChange={setInvalidMessage} rows={2} /></div>
                                        <div className="space-y-2"><Label>ข้อความเมื่อไม่ใช่รูปภาพ</Label><ReplyMessageTextarea value={notImageMessage} onChange={setNotImageMessage} rows={2} /></div>
                                        <div className="space-y-2"><Label>ข้อความเมื่อเนื้อหาไม่เหมาะสม</Label><ReplyMessageTextarea value={containMatureMessage} onChange={setContainMatureMessage} rows={2} disabled={!enabledModeration} /></div>
                                    </div>
                                </div>
                            </WidgetSettingsCardContent>
                            <WidgetSettingsCardFooter>
                                <DeleteWidgetButton onDelete={handleDelete} isLoading={isSaving} />
                                <div className="flex gap-2">
                                    <Button variant="outline" disabled={isTesting} onClick={handleTest}>
                                        {isTesting ? "Testing..." : <><Play className="mr-2 h-4 w-4" /> Test</>}
                                    </Button>
                                    <SaveWidgetButton onSave={handleSave} isLoading={isSaving} />
                                </div>
                            </WidgetSettingsCardFooter>
                        </WidgetSettingsCard>
                    </TabsContent>
                </Tabs>
            )}
        </WidgetConfigLayout>
    );
}
