"use client"

import { Button } from "@/components/ui/button";
import { WidgetStatusControl } from "@/components/widget/WidgetStatusControl";
import { WidgetTestControl } from "@/components/widget/WidgetTestControl";
import { OverlayUrlInput } from "@/components/widget/OverlayUrlInput";
import { BotProfileSelector } from "@/components/widget/BotProfileSelector";
import { OBSSetupHelp } from "@/components/widget/OBSSetupHelp";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/components/user-context";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Gift, ExternalLink, Play, MonitorPlay, ShieldCheck } from "lucide-react";
import { ChannelRewardSelector } from "@/components/widget/ChannelRewardSelector";
import { useEffect, useState } from "react";
import {
    enableDropImage,
    getDropImageConfig,
    updateDropImageConfig,
    refreshDropImageKey,
    testDropImage,
    type DropImageConfig,
} from "@/services/dropImage.service";
import { deleteWidget } from "@/services/widget.service";
import { getTwitchChannelRewards, type TwitchCustomReward } from "@/services/twitch.service";

import WidgetOverviewCard from "@/components/widget/widget-tab-card/WidgetOverviewCard";
import WidgetQuickStartCard from "@/components/widget/widget-tab-card/WidgetQuickStartCard";
import WidgetSettingsCard from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCard";
import WidgetSettingsCardContent from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardContent";
import WidgetSettingsCardFooter from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardFooter";
import { DeleteWidgetButton } from "@/components/button/DeleteWidgetButton";
import { SaveWidgetButton } from "@/components/button/SaveWidgetButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DropImageWidgetPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const [config, setConfig] = useState<DropImageConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEnabled, setIsEnabled] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);

    const [activeTab, setActiveTab] = useState("overview");
    const [rewards, setRewards] = useState<TwitchCustomReward[]>([]);
    const [isRewardsLoading, setIsRewardsLoading] = useState(false);
    const [showConfirmRefresh, setShowConfirmRefresh] = useState(false);

    // Form states
    const [twitchRewardId, setTwitchRewardId] = useState<string | null>(null);
    const [displayDuration, setDisplayDuration] = useState<number>(5);
    const [enabledModeration, setEnabledModeration] = useState(true);
    const [botProfile, setBotProfile] = useState<string>("");
    const [invalidMessage, setInvalidMessage] = useState<string>("");
    const [notImageMessage, setNotImageMessage] = useState<string>("");
    const [containMatureMessage, setContainMatureMessage] = useState<string>("");

    const overlayUrl = typeof window !== 'undefined' && user
        ? `${window.location.origin}/overlays/drop-image/${user.id}${config?.widget && config.widget.overlay_key ? `?key=${config.widget.overlay_key}` : ''}`
        : "";

    useEffect(() => {
        if (!user) return;
        const fetchRewards = async () => {
            setIsRewardsLoading(true);
            try {
                const data = await getTwitchChannelRewards();
                setRewards(data);
            } catch (error) {
                console.error("Failed to fetch rewards", error);
            } finally {
                setIsRewardsLoading(false);
            }
        };
        fetchRewards();
    }, [user]);

    useEffect(() => {
        if (isUserLoading) return;
        if (!user) {
            setIsLoading(false);
            return;
        }

        const fetchConfig = async () => {
            try {
                const data = await getDropImageConfig();
                if (data) {
                    setConfig(data);
                    setIsEnabled(data.widget?.enabled ?? false);
                    setTwitchRewardId(data.twitch_reward_id);
                    setDisplayDuration(data.display_duration);
                    setEnabledModeration(data.enabled_moderation ?? true);
                    setBotProfile(data.twitch_bot_id || "default");
                    setInvalidMessage(data.invalid_message || "");
                    setNotImageMessage(data.not_image_message || "");
                    setContainMatureMessage(data.contain_mature_message || "");
                    setActiveTab("settings");
                } else {
                    setConfig(null);
                    setBotProfile(user?.twitchId || "");
                }
            } catch (error) {
                console.error("Failed to fetch config", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchConfig();
    }, [user, isUserLoading]);

    const handleEnable = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const data = await enableDropImage(true);
            if (data) {
                setConfig(data);
                setIsEnabled(data.widget?.enabled ?? false);
                setTwitchRewardId(data.twitch_reward_id);
                setDisplayDuration(data.display_duration);
                setEnabledModeration(data.enabled_moderation ?? true);
                setBotProfile(data.twitch_bot_id || "default");
                setInvalidMessage(data.invalid_message || "");
                setNotImageMessage(data.not_image_message || "");
                setContainMatureMessage(data.contain_mature_message || "");
                setActiveTab("quick-start");
            }
        } catch (error) {
            console.error("Failed to enable", error);
        } finally {
            setIsSaving(false);
        }
    }

    const handleDelete = async () => {
        if (!config?.widget?.id) return;
        setIsSaving(true);
        try {
            const success = await deleteWidget(config.widget.id);
            if (success) {
                setConfig(null);
                setIsEnabled(false);
                setTwitchRewardId(null);
                setDisplayDuration(5);
                setEnabledModeration(true);
                setBotProfile("");
                setInvalidMessage("");
                setNotImageMessage("");
                setContainMatureMessage("");
                setActiveTab("overview");
            }
        } catch (error) {
            console.error("Failed to delete", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSwitchChange = async (checked: boolean) => {
        setIsEnabled(checked);
        if (!config) return;

        try {
            const updated = await updateDropImageConfig({
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

    const handleSave = async () => {
        if (!config) return;
        setIsSaving(true);
        try {
            const updated = await updateDropImageConfig({
                twitch_reward_id: twitchRewardId,
                display_duration: displayDuration,
                enabled_moderation: enabledModeration,
                twitch_bot_id: botProfile === "default" ? null : botProfile,
                invalid_message: invalidMessage || null,
                not_image_message: notImageMessage || null,
                contain_mature_message: containMatureMessage || null,
            });

            if (updated) {
                setConfig(updated);
            }
        } catch (error) {
            console.error("Failed to update config", error);
        } finally {
            setIsSaving(false);
        }
    }

    const handleRefreshKey = async () => {
        setIsSaving(true);
        try {
            const data = await refreshDropImageKey();
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

    const handleTest = async () => {
        if (!user || isTesting) return;

        let rewardId = twitchRewardId;

        if (!rewardId) {
            rewardId = "test-reward-id";
        }

        setIsTesting(true);
        try {
            const mockEvent = {
                subscription: {
                    status: "enabled",
                    type: "channel.channel_points_custom_reward_redemption.add"
                },
                event: {
                    id: "test-redemption-id-" + Date.now(),
                    broadcaster_user_id: user.twitchId,
                    broadcaster_user_login: user.username,
                    broadcaster_user_name: user.displayName,
                    user_id: user.twitchId,
                    user_login: user.username,
                    user_name: user.displayName,
                    user_input: "https://cdn.discordapp.com/attachments/1107965905448751126/1475124534150435068/Flower_stock_photo.png?ex=699c5847&is=699b06c7&hm=d820d4ba268eb29c5c8f4b5414415a0cd3cc17cf99613419d439fa033db95df7&",
                    status: "unfulfilled",
                    reward: {
                        id: rewardId,
                        title: `Test Drop Image Perk`,
                        cost: 1,
                        prompt: "Send an image url"
                    },
                    redeemed_at: new Date().toISOString()
                }
            };

            await testDropImage(mockEvent);

        } catch (error) {
            console.error("Test failed:", error);
        } finally {
            setIsTesting(false);
        }
    };

    if (isUserLoading || isLoading) {
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
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <ImageIcon className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold">Drop Image</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    ให้ผู้ชมของคุณโชว์รูปภาพบนหน้าจอผ่านการแลก Channel Points พร้อมระบบฟิสิกส์หล่นตุบๆ ลงมา
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
                            วิดเจ็ตนี้ช่วยให้ผู้ชมแลกแต้มช่องของคุณและส่ง URL ของรูปภาพ เพื่อให้มันไปตกลงบนหน้าจอสตรีมได้เลย
                        </p>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-500 mb-3">
                                    <MonitorPlay className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold mb-1">Interactive Display</h3>
                                <p className="text-sm text-muted-foreground">มีระบบฟิสิกส์ รองรับหลายๆ รูปพร้อมกัน รูปเก่าพอกลางทางก็จะหายไป</p>
                            </div>
                            <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                <div className="p-2 w-fit rounded-lg bg-purple-500/10 text-purple-500 mb-3">
                                    <Gift className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold mb-1">Channel Points</h3>
                                <p className="text-sm text-muted-foreground">เชื่อมต่อกับแต้มช่องของ Twitch และรับ URL ของภาพจากผู้ใช้ได้อย่างสะดวก</p>
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
                                title: `เลือกแต้มช่องที่ต้องการใช้งาน`,
                                description: (
                                    <div className="space-y-3">
                                        <p className="text-sm text-white/70">
                                            เลือก Channel Points Reward บน Twitch ที่มีอยู่แล้วเพื่อใช้กับ Widget นี้ ทริค: ควรเปิดให้ <span className="font-bold text-white">ต้องการการป้อนข้อความของผู้รับชม</span> เพื่อรับ URL รูป
                                        </p>
                                        <div className="flex gap-3">
                                            <div className="w-full">
                                                <ChannelRewardSelector
                                                    value={twitchRewardId}
                                                    onValueChange={setTwitchRewardId}
                                                    rewards={rewards}
                                                    isLoading={isRewardsLoading}
                                                    placeholder="เลือก Reward เพื่อใช้สำหรับการโชว์รูป..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                step: 3,
                                title: "ตั้งค่าระยะเวลาการแสดงผล",
                                description: (
                                    <div className="space-y-4">
                                        <p className="text-sm text-muted-foreground">คุณสามารถตั้งให้ภาพอยู่บนจอนานกี่วินาทีก่อนที่จะหายไป</p>
                                        <div className="border p-4 rounded-xl bg-muted/20">
                                            <div className="flex flex-col gap-2">
                                                <Label>ระยะเวลา (วินาที)</Label>
                                                <Input type="number" value={displayDuration} onChange={(e) => setDisplayDuration(Number(e.target.value))} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                step: 4,
                                title: "นำ Overlay ไปใส่ใน OBS",
                                description: (
                                    <div className="space-y-3">
                                        <p className="text-sm text-white/70">นำ URL นี้ไปใส่ใน Browser Source ของ OBS เพื่อให้รูปภาพแสดงผล</p>
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
                                step: 5,
                                title: "บันทึกและทดสอบ",
                                description: (
                                    <div className="space-y-3">
                                        <p className="text-sm text-white/70">กดบันทึกและทดสอบว่าการทำงานทั้งหมดถูกต้อง ลองกดที่ปุ่ม Test ด้านล่าง</p>

                                        <ol className="text-sm text-white/70 list-decimal pl-5 space-y-1 mt-2">
                                            <li>ต้องมีรูปหล่นลงมาใน OBS ของคุณเมื่อกดทดสอบ</li>
                                        </ol>
                                        <WidgetTestControl
                                            isSaving={isSaving}
                                            isTesting={isTesting}
                                            onSave={handleSave}
                                            onTest={handleTest}
                                            canTest={!!twitchRewardId}
                                        />
                                    </div>
                                )
                            },
                            {
                                step: 6,
                                title: "การตั้งค่าเพิ่มเติม",
                                description: (
                                    <div className="space-y-3">
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
                            <div className="space-y-6">
                                {/* Channel Reward */}
                                <div className="space-y-2">
                                    <Label>เชื่อมต่อ Twitch Reward</Label>
                                    <ChannelRewardSelector
                                        value={twitchRewardId}
                                        onValueChange={setTwitchRewardId}
                                        rewards={rewards}
                                        isLoading={isRewardsLoading}
                                        placeholder="เลือก Reward..."
                                    />
                                    <p className="text-sm text-muted-foreground mt-2">
                                        อย่าลืมตั้งค่าเปิด <span>Requires Viewer to Enter Text</span> เพื่อรับลิงก์รูป
                                    </p>
                                </div>

                                {/* Display Duration */}
                                <div className="space-y-2">
                                    <Label>ระยะเวลาการแสดงผลรูปภาพ (วินาที)</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={300}
                                        value={displayDuration}
                                        onChange={(e) => setDisplayDuration(Number(e.target.value))}
                                    />
                                </div>

                                {/* Content Moderation */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 border-b pb-2">
                                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                        <h3 className="text-lg font-semibold">Content Moderation</h3>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                        <div className="space-y-0.5">
                                            <Label>เปิดใช้งานการตรวจสอบเนื้อหา</Label>
                                            <p className="text-sm text-muted-foreground">
                                                ตรวจสอบรูปภาพที่ส่งมาว่ามีเนื้อหาไม่เหมาะสมหรือไม่ (NSFW / Gore)
                                            </p>
                                        </div>
                                        <Switch
                                            checked={enabledModeration}
                                            onCheckedChange={setEnabledModeration}
                                        />
                                    </div>
                                </div>

                                {/* Bot & Messages */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 border-b pb-2">
                                        <ImageIcon className="w-5 h-5 text-emerald-500" />
                                        <h3 className="text-lg font-semibold">ข้อความตอบกลับ</h3>
                                    </div>
                                    <BotProfileSelector
                                        value={botProfile}
                                        onValueChange={setBotProfile}
                                    />
                                    <div className="space-y-2">
                                        <Label>ข้อความเมื่อ URL ไม่ถูกต้อง</Label>
                                        <Textarea
                                            value={invalidMessage}
                                            onChange={(e) => setInvalidMessage(e.target.value)}
                                            placeholder="เช่น ลิงก์ที่ส่งมาไม่ถูกต้อง กรุณาส่งใหม่"
                                            rows={2}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ข้อความเมื่อไม่ใช่รูปภาพ</Label>
                                        <Textarea
                                            value={notImageMessage}
                                            onChange={(e) => setNotImageMessage(e.target.value)}
                                            placeholder="เช่น ไฟล์ที่ส่งมาไม่ใช่รูปภาพ กรุณาส่ง URL ของรูปภาพ"
                                            rows={2}
                                        />
                                    </div>
                                    {enabledModeration && (
                                        <div className="space-y-2">
                                            <Label>ข้อความเมื่อเนื้อหาไม่เหมาะสม</Label>
                                            <Textarea
                                                value={containMatureMessage}
                                                onChange={(e) => setContainMatureMessage(e.target.value)}
                                                placeholder="เช่น รูปภาพมีเนื้อหาไม่เหมาะสม ไม่สามารถแสดงได้"
                                                rows={2}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Overlay URL */}
                                <div className="space-y-4">
                                    <OverlayUrlInput
                                        url={overlayUrl}
                                        onRefresh={() => setShowConfirmRefresh(true)}
                                        showRefresh={true}
                                    />
                                </div>
                            </div>
                        </WidgetSettingsCardContent>
                        <WidgetSettingsCardFooter>
                            <DeleteWidgetButton
                                onDelete={handleDelete}
                                isLoading={isSaving}
                            />
                            <div className="flex gap-2">
                                <Button variant="outline" disabled={isTesting} onClick={handleTest}>
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
