"use client"

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ReplyMessageTextarea } from "@/components/widget/ReplyMessageTextarea";
import { WidgetTestControl } from "@/components/widget/WidgetTestControl";
import { SmartOverlayUrlInput } from "@/components/widget/SmartOverlayUrlInput";
import { BotProfileSelector } from "@/components/widget/BotProfileSelector";
import { OBSSetupHelp } from "@/components/widget/OBSSetupHelp";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Clock, Cog, ExternalLink, MessageSquare, Video } from "lucide-react";
import { MSDelaySlider } from "@/components/widget/MSDelaySlider";
import { WidgetStepper } from "@/components/widget/WidgetStepper/WidgetStepper";
import WidgetStepperItems from "@/components/widget/WidgetStepper/WidgetStepperItems/WidgetStepperItems";
import WidgetOverviewCard from "@/components/widget/widget-tab-card/WidgetOverviewCard";
import WidgetQuickStartCard from "@/components/widget/widget-tab-card/WidgetQuickStartCard";
import WidgetSettingsCard from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCard";
import WidgetSettingsCardContent from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardContent";
import WidgetSettingsCardFooter from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardFooter";
import { DeleteWidgetButton } from "@/components/button/DeleteWidgetButton";
import { SaveWidgetButton } from "@/components/button/SaveWidgetButton";
import { TestWidgetButton } from "@/components/button/TestWidgetButton";
import { WidgetConfigLayout } from "@/components/widget/layout/WidgetConfigLayout";

import { useClipShoutout } from "../hooks/useClipShoutout";
import { ClipShoutoutConfig } from "../types";
import WidgetEnabledBadge from "@/components/widget/WidgetEnabledBadge";
import { WidgetTypeMeta } from "@/services/widget.service";

export function ClipShoutoutWidget({ initialConfig, widgetType }: { initialConfig: ClipShoutoutConfig | null; widgetType: WidgetTypeMeta }) {
    const {
        user,
        config,
        replyMessage,
        replyMessageError,
        isEnabled,
        isSaving,
        isTesting,
        isUserLoading,
        botProfile,
        enabledClip,
        enabledHighlightOnly,
        activeTab,
        overlayUrl,
        delayMs,
        setDelayMs,
        setBotProfile,
        setEnabledClip,
        setEnabledHighlightOnly,
        setActiveTab,
        setConfig,
        handleEnable,
        handleSave,
        handleTest,
        handleDelete,
        handleReplyMessageChange,
        handleStatusChange
    } = useClipShoutout(initialConfig);

    if (isUserLoading) {
        return (
            <div className="container mx-auto py-10">
                <Skeleton className="h-[300px] w-full max-w-2xl mx-auto rounded-xl" />
            </div>
        )
    }

    const shoutoutVariables = [
        { variable: "{{user_name}}", description: "ชื่อที่แสดงผลของผู้ทักทาย", example: "User123" },
        { variable: "{{viewer_count}}", description: "จำนวนผู้ชมที่มาพร้อม Raid", example: "150" },
        { variable: "{{channel_link}}", description: "ลิงก์ไปยังช่องของผู้ Raid", example: "https://twitch.tv/user123" }
    ];

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
                                เมื่อมีสตรีมเมอร์ท่านอื่นเข้ามาร่วม Raid ช่องของคุณ วิดเจ็ตนี้ช่วยให้การ Shoutout ดูโปรและน่าสนใจขึ้น!
                                ระบบจะค้นหาและเล่นคลิปล่าสุดของพวกเขาบนหน้าจอของคุณอัตโนมัติ ทำให้ผู้ชมของคุณได้รู้จักแขกผู้มาเยือนแบบเห็นภาพจริง
                            </p>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                    <div className="p-2 w-fit rounded-lg bg-orange-500/10 text-orange-500 mb-3">
                                        <Video className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold mb-1">Auto Clip Player</h3>
                                    <p className="text-sm text-muted-foreground">เล่นคลิปล่าสุดของ Raider อัตโนมัติบน Overlay</p>
                                </div>
                                <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                    <div className="p-2 w-fit rounded-lg bg-blue-500/10 text-blue-500 mb-3">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold mb-1">Custom Shoutout</h3>
                                    <p className="text-sm text-muted-foreground">ส่งข้อความขอบคุณและแนะนำช่องของ Raider ในแชท</p>
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
                                            title: "ตั้งค่าข้อความ",
                                            description: (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-white/70">ข้อความที่จะส่งในแชทเมื่อมีการ Raid เข้ามา</p>
                                                    <ReplyMessageTextarea
                                                        defaultOpenHelp
                                                        value={replyMessage}
                                                        onChange={handleReplyMessageChange}
                                                        error={replyMessageError}
                                                        variables={shoutoutVariables}
                                                    />
                                                </div>
                                            )
                                        },
                                        {
                                            step: 3,
                                            title: "นำ Overlay ไปใส่ใน OBS",
                                            description: (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-white/70">นำ URL นี้ไปใส่ใน Browser Source ของ OBS เพื่อให้คลิปแสดงผล</p>
                                                    <SmartOverlayUrlInput
                                                        url={overlayUrl}
                                                        slug="clip-shoutout"
                                                        onSuccess={setConfig}
                                                        hideLabel
                                                    />
                                                    <OBSSetupHelp defaultOpen />
                                                </div>
                                            )
                                        },
                                        {
                                            step: 4,
                                            title: "บันทึกและทดสอบ",
                                            description: (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-white/70">กดบันทึกและทดสอบว่าการทำงานทั้งหมดถูกต้อง ลองกดที่ปุ่ม Test ด้านล่าง</p>
                                                    <ol className="text-sm text-white/70 list-decimal pl-5 space-y-1 mt-2">
                                                        <li>ต้องมีข้อความแสดงขึ้นมาบนช่องแชท Twitch ของคุณ</li>
                                                        <li>ต้องมี Clip ของช่องที่ Raid เข้ามาแสดงขึ้นมาบนหน้าจอของคุณ</li>
                                                    </ol>
                                                    <WidgetTestControl isSaving={isSaving} isTesting={isTesting} onSave={handleSave} onTest={handleTest} canTest={true} />
                                                </div>
                                            )
                                        },
                                        {
                                            step: 5,
                                            title: "การตั้งค่าเพิ่มเติม",
                                            description: (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-white/70">เลือกเปิด/ปิดการเล่นคลิป หรือกำหนดให้เล่นเฉพาะ Highlight ได้ใน Settings</p>
                                                    <div className="flex justify-start">
                                                        <Button variant="secondary" onClick={() => setActiveTab("settings")} className="bg-white/10 text-white hover:bg-white/20 border-0 gap-2">
                                                            ไปที่การตั้งค่า (Settings) <ExternalLink className="h-4 w-4" />
                                                        </Button>
                                                    </div>
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
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 border-b pb-2">
                                        <Clock className="w-5 h-5 text-purple-500" />
                                        <h3 className="text-lg font-semibold">ดีเลย์ (Delay)</h3>
                                    </div>
                                    <div className="bg-card space-y-2">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="space-y-0.5">
                                                <Label>เวลาดีเลย์ก่อนการ Shoutout</Label>
                                                <p className="text-sm text-muted-foreground">กำหนดเวลาหน่วงหลังจากมีคนเข้าร่วม Raid เข้ามาก่อนจะส่งข้อความและเล่นคลิป</p>
                                            </div>
                                        </div>
                                        <MSDelaySlider value={delayMs} onChange={setDelayMs} />
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 border-b pb-2">
                                        <MessageSquare className="w-5 h-5 text-blue-500" />
                                        <h3 className="text-lg font-semibold">ข้อความ Shoutout</h3>
                                    </div>
                                    <BotProfileSelector value={botProfile} onValueChange={setBotProfile} />
                                    <ReplyMessageTextarea value={replyMessage} onChange={handleReplyMessageChange} variant="default" error={replyMessageError} variables={shoutoutVariables} />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 border-b pb-2">
                                        <Video className="w-5 h-5 text-orange-500" />
                                        <h3 className="text-lg font-semibold">ตัวเลือกวิดีโอ</h3>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                        <div className="space-y-0.5">
                                            <Label>แสดง Clip ของช่องที่ Raid</Label>
                                            <p className="text-sm text-muted-foreground">แสดง Clip ของช่องที่ Raid ขึ้นมาบนสตรีมของคุณ</p>
                                        </div>
                                        <Switch checked={enabledClip} onCheckedChange={setEnabledClip} />
                                    </div>

                                    {enabledClip && (
                                        <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                            <div className="space-y-0.5 mr-4">
                                                <Label>เล่นเฉพาะ Highlight</Label>
                                                <p className="text-sm text-muted-foreground">หากเปิดใช้งาน จะสุ่มเลือกเฉพาะคลิปที่ถูกตั้งเป็นไฮไลท์ขึ้นมาก่อน หากช่องนั้นไม่มีคลิปที่เป็นไฮไลท์ จะสุ่มเลือกคลิปทั่วไปแทน</p>
                                            </div>
                                            <Switch checked={enabledHighlightOnly} onCheckedChange={setEnabledHighlightOnly} />
                                        </div>
                                    )}

                                    {enabledClip && (
                                        <SmartOverlayUrlInput 
                                            url={overlayUrl} 
                                            slug="clip-shoutout"
                                            onSuccess={setConfig}
                                        />
                                    )}
                                </div>
                            </WidgetSettingsCardContent>
                            <WidgetSettingsCardFooter>
                                <DeleteWidgetButton onDelete={handleDelete} isLoading={isSaving} />
                                <div className="flex gap-2">
                                    <TestWidgetButton onTest={handleTest} isLoading={isTesting} />
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
