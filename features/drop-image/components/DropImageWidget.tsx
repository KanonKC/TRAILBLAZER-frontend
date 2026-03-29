"use client"

import { Button } from "@/components/ui/button";
import { WidgetStatusControl } from "@/components/widget/WidgetStatusControl";
import { WidgetTestControl } from "@/components/widget/WidgetTestControl";
import { SmartOverlayUrlInput } from "@/components/widget/SmartOverlayUrlInput";
import { BotProfileSelector } from "@/components/widget/BotProfileSelector";
import { OBSSetupHelp } from "@/components/widget/OBSSetupHelp";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Gift, ExternalLink, Play, ShieldCheck, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { TwitchRewardSelector } from "@/components/widget/TwitchRewardSelector";
import WidgetOverviewCard from "@/components/widget/widget-tab-card/WidgetOverviewCard";
import WidgetQuickStartCard from "@/components/widget/widget-tab-card/WidgetQuickStartCard";
import WidgetSettingsCard from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCard";
import WidgetSettingsCardContent from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardContent";
import WidgetSettingsCardFooter from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardFooter";
import { DeleteWidgetButton } from "@/components/button/DeleteWidgetButton";
import { SaveWidgetButton } from "@/components/button/SaveWidgetButton";
import { Label } from "@/components/ui/label";
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { ReplyMessageTextarea } from "@/components/widget/ReplyMessageTextarea";

import { useDropImage } from "../hooks/useDropImage";
import { DropImageConfig } from "../types";
import WidgetEnabledBadge from "@/components/widget/WidgetEnabledBadge";

export function DropImageWidget({ initialConfig }: { initialConfig: DropImageConfig | null }) {
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
        <div className="container mx-auto py-10 flex flex-col items-center">
            <div className="w-full max-w-2xl mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                        <ImageIcon className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold">Drop Image</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    ให้ผู้ชมของคุณโชว์รูปภาพบนหน้าจอผ่านการแลกแต้มช่อง พร้อมระบบฟิสิกส์หล่นตุบๆ ลงมา
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-2xl">
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
                    <WidgetOverviewCard showLoginButton={!user} showEnableButton={!!user && !config} onClickEnable={handleEnable} isLoading={isSaving}>
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
                        {[
                            {
                                step: 1,
                                title: "เปิดใช้งาน Widget",
                                description: <WidgetEnabledBadge/>
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
                                        <OBSSetupHelp type="image" />
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
                        ].map((item, index, array) => (
                            <div key={item.step} className="flex gap-4 relative pb-10 last:pb-0">
                                <div className="flex flex-col items-center">
                                    <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white font-bold text-sm z-10">{item.step}</div>
                                    {index !== array.length - 1 && <div className="w-[2px] bg-white/10 absolute top-8 bottom-0 left-4" />}
                                </div>
                                <div className="space-y-1 pt-1 flex-1 min-w-0">
                                    <h3 className="font-semibold mb-2 text-white">{item.title}</h3>
                                    <div className="text-sm">{item.description}</div>
                                </div>
                            </div>
                        ))}
                    </WidgetQuickStartCard>
                </TabsContent>

                <TabsContent value="settings">
                    <WidgetSettingsCard widgetId={config?.widget?.id} isEnabled={isEnabled} onStatusChange={handleStatusChange}>
                        <WidgetSettingsCardContent>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label>เชื่อมต่อ Twitch Reward</Label>
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

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                        <Label>เปิดใช้งานการตรวจสอบเนื้อหา (Moderation)</Label>
                                        <Switch checked={enabledModeration} onCheckedChange={setEnabledModeration} />
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

        </div>
    );
}
