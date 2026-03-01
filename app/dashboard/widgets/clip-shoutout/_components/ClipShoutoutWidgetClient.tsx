"use client"

import { Button } from "@/components/ui/button";
import { WidgetStatusControl } from "@/components/widget/WidgetStatusControl";
import { ReplyMessageTextarea } from "@/components/widget/ReplyMessageTextarea";
import { WidgetTestControl } from "@/components/widget/WidgetTestControl";
import { OverlayUrlInput } from "@/components/widget/OverlayUrlInput";
import { BotProfileSelector } from "@/components/widget/BotProfileSelector";
import { OBSSetupHelp } from "@/components/widget/OBSSetupHelp";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/components/user-context";
import { cn } from "@/lib/utils";
import { ExternalLink, MessageSquare, Play, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

import {
    enableClipShoutout,
    testClipShoutout,
    updateClipShoutoutConfig,
    refreshClipShoutoutOverlayKey,
    type ClipShoutoutConfig
} from "@/services/clipShoutout.service";
import { deleteWidget } from "@/services/widget.service";
import WidgetOverviewCard from "@/components/widget/widget-tab-card/WidgetOverviewCard";
import WidgetQuickStartCard from "@/components/widget/widget-tab-card/WidgetQuickStartCard";
import WidgetSettingsCard from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCard";
import WidgetSettingsCardContent from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardContent";
import WidgetSettingsCardFooter from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardFooter";
import { DeleteWidgetButton } from "@/components/button/DeleteWidgetButton";
import { SaveWidgetButton } from "@/components/button/SaveWidgetButton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function ClipShoutoutWidgetClient({ initialConfig }: { initialConfig: ClipShoutoutConfig | null }) {
    const { user, isLoading: isUserLoading } = useUser();
    const [config, setConfig] = useState<ClipShoutoutConfig | null>(initialConfig);
    const [replyMessage, setReplyMessage] = useState(initialConfig?.reply_message || "");
    const [replyMessageError, setReplyMessageError] = useState<string | null>(null);
    const [isEnabled, setIsEnabled] = useState(initialConfig?.enabled ?? (initialConfig ? true : false));
    const [isSaving, setIsSaving] = useState(false);
    const [botProfile, setBotProfile] = useState<string>(initialConfig?.twitch_bot_id || user?.twitchId || "");

    // New states for Clip Shoutout
    const [enabledClip, setEnabledClip] = useState(initialConfig?.enabled_clip ?? true);
    const [enabledHighlightOnly, setEnabledHighlightOnly] = useState(initialConfig?.enabled_highlight_only ?? false);

    const [showConfirmRefresh, setShowConfirmRefresh] = useState(false);
    const [activeTab, setActiveTab] = useState(initialConfig ? "settings" : "overview");

    const handleDelete = async () => {
        if (!config?.widget?.id) return;
        setIsSaving(true);
        try {
            const success = await deleteWidget(config.widget.id);
            if (success) {
                setConfig(null);
                setReplyMessage("");
                setIsEnabled(false);
                setActiveTab("overview");
            }
        } catch (error) {
            console.error("Failed to delete", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleRefreshKey = async () => {
        setIsSaving(true);
        try {
            const data = await refreshClipShoutoutOverlayKey();
            if (data) {
                setConfig(data);
            }
        } catch (error) {
            console.error("Failed to refresh key", error);
        } finally {
            setIsSaving(false);
            setShowConfirmRefresh(false);
        }
    };

    const [isTesting, setIsTesting] = useState(false);

    const overlayUrl = typeof window !== 'undefined' && user
        ? `${window.location.origin}/overlays/clip-shoutout/${user.id}${config?.widget && config.widget.overlay_key ? `?key=${config.widget.overlay_key}` : ''}`

        : "";

    useEffect(() => {
        // Initial load logic is now handled server-side.
        if (!initialConfig && user?.twitchId) {
            setBotProfile(user.twitchId);
        }
    }, [user?.twitchId, initialConfig]);

    const handleEnable = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const data = await enableClipShoutout(user.twitchId, user.id);
            if (data) {
                setConfig(data);
                setReplyMessage(data.reply_message || "");
                setIsEnabled(data.enabled ?? true);
                setEnabledClip(data.enabled_clip ?? true);
                setEnabledHighlightOnly(data.enabled_highlight_only ?? false);
                setActiveTab("quick-start");
            }
        } catch (error) {
            console.error("Failed to enable", error);
        } finally {
            setIsSaving(false);
        }
    }

    const replyMessageSchema = z.string().max(500, "ข้อความต้องไม่เกิน 500 ตัวอักษร");

    const handleReplyMessageChange = (value: string) => {
        setReplyMessage(value);
        if (replyMessageError) {
            const result = replyMessageSchema.safeParse(value);
            if (result.success) {
                setReplyMessageError(null);
            }
        }
    };

    const handleSave = async () => {
        if (!config) return;

        const result = replyMessageSchema.safeParse(replyMessage);
        if (!result.success) {
            setReplyMessageError(result.error.issues[0].message);
            return;
        }

        setIsSaving(true);
        try {
            const updated = await updateClipShoutoutConfig({
                reply_message: replyMessage,
                twitch_bot_id: botProfile === "default" ? null : botProfile,
                enabled_clip: enabledClip,
                enabled_highlight_only: enabledHighlightOnly
            });

            if (updated) {
                setConfig(updated);
            }
        } catch (error) {
            console.error("Failed to update", error);
        } finally {
            setIsSaving(false);
        }
    }

    const handleTest = async () => {
        if (!user || isTesting) return;

        setIsTesting(true);
        try {
            const mockEvent = {
                subscription: {
                    status: "enabled",
                    type: "channel.chat.notification"
                },
                event: {
                    broadcaster_user_id: user.twitchId,
                    broadcaster_user_login: user.username,
                    broadcaster_user_name: user.displayName,
                    chatter_user_id: "0",
                    chatter_user_login: "testuser",
                    chatter_user_name: "TestUser",
                    message: {
                        text: "Test Shoutout",
                        fragments: []
                    },
                    color: "#FF0000",
                    badges: [],
                    system_message: "TestUser raided you with 100 viewers!",
                    notice_type: "raid",
                    raid: {
                        user_id: user.twitchId,
                        user_login: "testuser",
                        user_name: `TestUser_${Math.random().toString().slice(2, 8)}`,
                        viewer_count: 100,
                        profile_image_url: ""
                    }
                }
            };

            await testClipShoutout(mockEvent);

        } catch (error) {
            console.error("Test failed:", error);
        } finally {
            setIsTesting(false);
        }
    };

    const handleSwitchChange = async (checked: boolean) => {
        setIsEnabled(checked);
        if (!config) return;

        try {
            const updated = await updateClipShoutoutConfig({
                enabled: checked
            });

            if (updated) {
                setConfig(updated);
            } else {
                setIsEnabled(!checked);
            }
        } catch (error) {
            console.error("Failed to update status", error);
            setIsEnabled(!checked);
        }
    }

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
                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                        <Video className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold">Clip Shoutout</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    โปรโมทเพื่อนสตรีมเมอร์ที่มา Raid ด้วยการโชว์คลิปล่าสุดของอัตโนมัติ
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
                    <WidgetOverviewCard
                        showLoginButton={!user}
                        showEnableButton={!!user && !config}
                        onClickEnable={handleEnable}
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
                        {[
                            {
                                step: 1,
                                title: "เปิดใช้งาน Widget",
                                description: (
                                    <WidgetStatusControl
                                        isEnabled={isEnabled}
                                        isSaving={isSaving}
                                        onEnable={handleEnable}
                                    />
                                )
                            },
                            {
                                step: 2,
                                title: "ตั้งค่าข้อความ",
                                description: (
                                    <div className="space-y-3">
                                        <p className="text-sm text-white/70">ข้อความที่จะส่งในแชทเมื่อมีการ Raid เข้ามา</p>
                                        <ReplyMessageTextarea
                                            hideLabel
                                            value={replyMessage}
                                            onChange={handleReplyMessageChange}
                                            error={replyMessageError}
                                            variables={[
                                                {
                                                    variable: "{{user_name}}",
                                                    description: "ชื่อที่แสดงผลของผู้ทักทาย",
                                                    example: "User123"
                                                },
                                                {
                                                    variable: "{{viewer_count}}",
                                                    description: "จำนวนผู้ชมที่มาพร้อม Raid",
                                                    example: "150"
                                                },
                                                {
                                                    variable: "{{channel_link}}",
                                                    description: "ลิงก์ไปยังช่องของผู้ Raid",
                                                    example: "https://twitch.tv/user123"
                                                }
                                            ]}
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
                                        <OverlayUrlInput
                                            url={overlayUrl}
                                            className="text-white"
                                            inputClassName="bg-transparent border-white/20 text-white"
                                            showRefresh={true}
                                            onRefresh={() => setShowConfirmRefresh(true)}
                                            hideLabel
                                        />
                                        <OBSSetupHelp />
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
                                        <WidgetTestControl
                                            isSaving={isSaving}
                                            isTesting={isTesting}
                                            onSave={handleSave}
                                            onTest={handleTest}
                                            canTest={true}
                                        />
                                    </div>
                                )
                            },
                            {
                                step: 5,
                                title: "การตั้งค่าเพิ่มเติม",
                                description: (
                                    <div className="space-y-3">
                                        <p className="text-sm text-white/70">
                                            คุณสามารถเลือกเปิด/ปิดการเล่นคลิป หรือกำหนดให้เล่นเฉพาะ Highlight ได้ใน Settings
                                        </p>
                                        <div className="flex justify-start">
                                            <Button
                                                variant="secondary"
                                                onClick={() => setActiveTab("settings")}
                                                className="bg-white/10 text-white hover:bg-white/20 border-0 gap-2"
                                            >
                                                ไปที่การตั้งค่า (Settings)
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )
                            }
                        ].map((item, index, array) => (
                            <div key={item.step} className="flex gap-4 relative pb-10 last:pb-0">
                                <div className="flex flex-col items-center">
                                    <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white font-bold text-sm z-10 bg-transparent ring-4 ring-transparent">
                                        {item.step}
                                    </div>
                                    {index !== array.length - 1 && (
                                        <div className="w-[2px] bg-white/10 absolute top-8 bottom-0 left-4 -ml-[1px]" />
                                    )}
                                </div>
                                <div className="space-y-1 pt-1 flex-1 min-w-0">
                                    <h3 className="font-semibold leading-none mb-2 text-white">{item.title}</h3>
                                    <div className="text-sm">{item.description}</div>
                                </div>
                            </div>
                        ))}
                    </WidgetQuickStartCard>
                </TabsContent>

                <TabsContent value="settings">
                    <WidgetSettingsCard
                        isEnabled={isEnabled}
                        handleSwitchChange={handleSwitchChange}
                    >
                        <WidgetSettingsCardContent>
                            {/* Message Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b pb-2">
                                    <MessageSquare className="w-5 h-5 text-blue-500" />
                                    <h3 className="text-lg font-semibold">ข้อความ Shoutout</h3>
                                </div>
                                <div className="">
                                    <BotProfileSelector
                                        value={botProfile}
                                        onValueChange={setBotProfile}
                                    />
                                </div>
                                <ReplyMessageTextarea
                                    value={replyMessage}
                                    onChange={handleReplyMessageChange}
                                    variant="default"
                                    error={replyMessageError}
                                    variables={[
                                        {
                                            variable: "{{user_name}}",
                                            description: "ชื่อที่แสดงผลของผู้ทักทาย",
                                            example: "User123"
                                        },
                                        {
                                            variable: "{{viewer_count}}",
                                            description: "จำนวนผู้ชมที่มาพร้อม Raid",
                                            example: "150"
                                        },
                                        {
                                            variable: "{{channel_link}}",
                                            description: "ลิงก์ไปยังช่องของผู้ Raid",
                                            example: "https://twitch.tv/user123"
                                        }
                                    ]}
                                />
                            </div>

                            {/* Clip Options */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b pb-2">
                                    <Video className="w-5 h-5 text-orange-500" />
                                    <h3 className="text-lg font-semibold">ตัวเลือกวิดีโอ</h3>
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                    <div className="space-y-0.5">
                                        <Label>แสดง Clip ของช่องที่ Raid</Label>
                                        <p className="text-sm text-muted-foreground">
                                            แสดง Clip ของช่องที่ Raid ขึ้นมาบนสตรีมของคุณ
                                        </p>
                                    </div>
                                    <Switch
                                        checked={enabledClip}
                                        onCheckedChange={setEnabledClip}
                                    />
                                </div>

                                {
                                    enabledClip && (
                                        <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                            <div className="space-y-0.5">
                                                <Label>เล่นเฉพาะ Highlight</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    หากเปิด จะเล่นเฉพาะคลิปที่ถูกตั้งเป็น Highlight เท่านั้น (หากไม่มี Highlight จะไม่เล่น)
                                                </p>
                                            </div>
                                            <Switch
                                                checked={enabledHighlightOnly}
                                                onCheckedChange={setEnabledHighlightOnly}
                                            />
                                        </div>
                                    )
                                }

                                {
                                    enabledClip && (
                                        <OverlayUrlInput
                                            url={overlayUrl}
                                            onRefresh={() => setShowConfirmRefresh(true)}
                                            showRefresh={true}
                                        />
                                    )
                                }
                            </div>
                        </WidgetSettingsCardContent>
                        <WidgetSettingsCardFooter>
                            <DeleteWidgetButton
                                onDelete={handleDelete}
                                isLoading={isSaving}
                            />
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleTest} disabled={isTesting}>
                                    {isTesting ? "Testing..." : (
                                        <>
                                            <Play className="mr-2 h-4 w-4" />
                                            Test
                                        </>
                                    )}
                                </Button>
                                <SaveWidgetButton
                                    onSave={handleSave}
                                    isLoading={isSaving}
                                />
                            </div>
                        </WidgetSettingsCardFooter>
                    </WidgetSettingsCard>
                </TabsContent>
            </Tabs>

            <AlertDialog open={showConfirmRefresh} onOpenChange={setShowConfirmRefresh}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>คุณต้องการรีเซ็ต Overlay Key หรือไม่?</AlertDialogTitle>
                        <AlertDialogDescription>
                            การรีเซ็ต Key จะทำให้ URL เดิมใช้งานไม่ได้ คุณจะต้องคัดลอก URL ใหม่ไปใส่ในโปรแกรมสตรีมของคุณ
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={handleRefreshKey}
                        >
                            ยืนยันการรีเซ็ต
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
