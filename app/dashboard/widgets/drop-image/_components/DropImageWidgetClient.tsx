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
import { Image as ImageIcon, Gift, ExternalLink, Play, ShieldCheck, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { ChannelRewardSelector } from "@/components/widget/ChannelRewardSelector";
import { useEffect, useState } from "react";
import {
    enableDropImage,
    updateDropImageConfig,
    refreshDropImageKey,
    testDropImage,
    type DropImageConfig,
} from "@/services/dropImage.service";
import { deleteWidget } from "@/services/widget.service";
import { getTwitchChannelRewards, type TwitchCustomReward } from "@/services/twitch.service";
import { tbToast } from "@/utils/tbToast";
import { WidgetStepper } from "@/components/widget/WidgetStepper/WidgetStepper";
import WidgetStepperItems from "@/components/widget/WidgetStepper/WidgetStepperItems/WidgetStepperItems";

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
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ReplyMessageTextarea } from "@/components/widget/ReplyMessageTextarea";
import WidgetEnabledBadge from "@/components/widget/WidgetEnabledBadge";

export function DropImageWidgetClient({ initialConfig }: { initialConfig: DropImageConfig | null }) {
    const { user, isLoading: isUserLoading } = useUser();
    const [config, setConfig] = useState<DropImageConfig | null>(initialConfig);
    const [isEnabled, setIsEnabled] = useState(initialConfig?.widget?.enabled ?? false);
    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);

    const [activeTab, setActiveTab] = useState(initialConfig ? "settings" : "overview");
    const [rewards, setRewards] = useState<TwitchCustomReward[]>([]);
    const [isRewardsLoading, setIsRewardsLoading] = useState(false);
    const [showConfirmRefresh, setShowConfirmRefresh] = useState(false);

    // Form states
    const [twitchRewardId, setTwitchRewardId] = useState<string | null>(initialConfig?.twitch_reward_id || null);
    const [displayDuration, setDisplayDuration] = useState<number>(initialConfig?.display_duration || 5);
    const [enabledModeration, setEnabledModeration] = useState(initialConfig?.enabled_moderation ?? true);
    const [botProfile, setBotProfile] = useState<string>(initialConfig?.twitch_bot_id || user?.twitchId || "");
    const [invalidMessage, setInvalidMessage] = useState<string>(initialConfig?.invalid_message || "");
    const [notImageMessage, setNotImageMessage] = useState<string>(initialConfig?.not_image_message || "");
    const [containMatureMessage, setContainMatureMessage] = useState<string>(initialConfig?.contain_mature_message || "");

    const overlayUrl = typeof window !== 'undefined' && user
        ? `${window.location.origin}/overlays/drop-image/${user.id}${config?.widget && config.widget.overlay_key ? `?key=${config.widget.overlay_key}` : ''}`
        : "";

    useEffect(() => {
        if (!user) return;
        const fetchRewards = async () => {
            setIsRewardsLoading(true);
            try {
                const data = await getTwitchChannelRewards({ userInputRequired: true });
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
        if (!initialConfig && user?.twitchId) {
            setBotProfile(user.twitchId);
        }
    }, [user?.twitchId, initialConfig]);

    const handleEnable = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const data = await enableDropImage(true);
            if (data) {
                tbToast.success({ title: "เปิดใช้งานสำเร็จ" });
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
            tbToast.error({ title: "เปิดใช้งานไม่สำเร็จ" });
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
                tbToast.success({ title: "ลบวิดเจ็ตสำเร็จ" });
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
            tbToast.error({ title: "ไม่สามารถลบวิดเจ็ตได้" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleStatusChange = (checked: boolean) => {
        setIsEnabled(checked);
        setConfig(prev => prev ? {
            ...prev,
            widget: {
                ...prev.widget,
                is_enabled: checked
            }
        } : null);
    };

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
                tbToast.success({ title: "บันทึกการตั้งค่าสำเร็จ" });
                setConfig(updated);
            }
        } catch (error: any) {
            console.error("Failed to update config aaa", error);
            tbToast.error({ title: "ไม่สามารถบันทึกการตั้งค่าได้", error: error.response.data });
        } finally {
            setIsSaving(false);
        }
    }

    const handleRefreshKey = async () => {
        setIsSaving(true);
        try {
            const data = await refreshDropImageKey();
            if (data) {
                tbToast.success({ title: "รีเซ็ตคีย์สำเร็จ" });
                setConfig(data);
            }
        } catch (error) {
            console.error("Failed to refresh key", error);
            tbToast.error({ title: "ไม่สามารถรีเซ็ตคีย์ได้" });
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
                    type: "channel.chat.message"
                },
                event: {
                    broadcaster_user_id: user.twitchId,
                    broadcaster_user_login: user.username,
                    broadcaster_user_name: user.displayName,
                    chatter_user_id: user.twitchId,
                    chatter_user_login: user.username,
                    chatter_user_name: user.displayName,
                    message_id: "test-message-id-" + Date.now(),
                    message: {
                        text: "https://hips.hearstapps.com/hmg-prod/images/summer-flowers-1648478322.jpg",
                        fragments: [{
                            type: "text",
                            text: "https://hips.hearstapps.com/hmg-prod/images/summer-flowers-1648478322.jpg",
                            cheermote: null,
                            emote: null,
                            mention: null
                        }]
                    },
                    color: "",
                    badges: [],
                    message_type: "text",
                    cheer: null,
                    reply: null,
                    channel_points_custom_reward_id: rewardId,
                    source_broadcaster_user_id: null,
                    source_broadcaster_user_login: null,
                    source_broadcaster_user_name: null,
                    source_message_id: null,
                    source_badges: null
                }
            };

            await testDropImage(mockEvent);
            tbToast.success({ title: "ทดสอบวิดเจ็ตสำเร็จ" });

        } catch (error) {
            console.error("Test failed:", error);
            tbToast.error({ title: "ทดสอบวิดเจ็ตไม่สำเร็จ" });
        } finally {
            setIsTesting(false);
        }
    };

    const quickStartSteps = [
        {
            step: 1,
            title: "เปิดใช้งาน Widget",
            description: (
                <WidgetEnabledBadge/>
            )
        },
        {
            step: 2,
            title: `เลือกแต้มช่องที่ต้องการใช้งาน`,
            description: (
                <div className="space-y-3">
                    <p className="text-sm text-white/70">
                        เลือก Channel Points Reward บน Twitch ที่มีอยู่แล้วเพื่อใช้กับ Widget นี้ หรือ <Button
                            variant="ghost"
                            size="sm"
                            className="w-fit h-auto p-0 text-purple-400 hover:text-purple-300 hover:bg-transparent gap-1 self-end text-sm"
                            onClick={() => window.open("https://dashboard.twitch.tv/viewer-rewards/channel-points/rewards", "_blank")}
                        >
                            ไปที่ Twitch Dashboard
                            <ExternalLink className="w-3 h-3" />
                        </Button> เพื่อสร้างแต้มช่องอันใหม่
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
                    <p className="text-sm text-muted-foreground">ตั้งเวลาที่จะให้รูปภาพแสดงค้างไว้ที่หน้าจอ ก่อนที่รูปภาพจะหายไป</p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Slider
                                value={[displayDuration]}
                                onValueChange={([v]) => setDisplayDuration(v)}
                                min={1}
                                max={20}
                                step={1}
                                className="flex-1 cursor-pointer"
                            />
                            <span className="text-sm tabular-nums w-16 text-right text-muted-foreground shrink-0">
                                {displayDuration} วินาที
                            </span>
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
                    <OBSSetupHelp type="image" />
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
            title: "อธิบายให้คนดูเข้าใจเกี่ยวกับการวางลิงก์รูป",
            description: (
                <div className="space-y-3">
                    <p className="text-sm text-white/70">เนื่องจากคำว่า &quot;ลิงก์รูปภาพ&quot; เป็นสิ่งที่เข้าใจยากสำหรับทั้งสตรีมเมอร์และคนดู ในขั้นตอนนี้จึงเป็นการอธิบายให้เข้าใจว่ามันคืออะไร เพื่อที่จะสามารถนำไปอธิบายต่อให้กับคนดูระหว่างสตรีมได้</p>
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm flex gap-3">
                        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold mb-1">ลิงก์รูปภาพ (Image URL) คืออะไร?</p>
                            <div className="space-y-2 mt-2">
                                <p className="text-blue-100/90 leading-relaxed text-sm">
                                    คือ <strong>ที่อยู่ของรูปภาพนั้นๆ บนอินเทอร์เน็ต</strong> สังเกตง่ายๆ คือ ลิงก์ที่ใช้ได้มักจะยาวๆ และ <span className="font-semibold text-emerald-400">ลงท้ายด้วยนามสกุลไฟล์รูปภาพ</span> เช่น .jpg, .png, หรือ .gif
                                </p>

                                <div className="">
                                    <p className="font-semibold text-blue-100 mb-2 border-b border-blue-500/20 pb-1">       วิธีที่ง่ายที่สุดในการบอกคนดูว่าจะเอาลิงก์ได้จากที่ไหน</p>
                                    <ul className="list-disc pl-5 space-y-2 text-blue-100/80 text-sm">
                                        <li>
                                            <span className="font-semibold text-indigo-300">จาก Discord:</span> เป็นวิธีที่เห็นคนดูหลายคนทำบ่อยที่สุดคืออัพรูปลง Discord (อาจจะสร้างห้องส่วนตัวขึ้นมาก็ได้) <br />กดที่รูปให้ขยายใหญ่ {'>'} กดค้าง (มือถือ) หรือคลิกขวา (คอม) {'>'} เลือก <strong>&quot;คัดลอกลิงก์สื่อ (Copy Media Link)&quot;</strong>
                                        </li>
                                        <li>
                                            <span className="font-semibold text-blue-200">บนคอมพิวเตอร์ (PC):</span> ค้นหารูป {'>'} คลิกขวาที่รูป {'>'} เลือก <strong>&quot;คัดลอกที่อยู่รูปภาพ (Copy image address)&quot;</strong>
                                        </li>
                                        <li>
                                            <span className="font-semibold text-blue-200">บนมือถือ:</span> กดค้างที่รูปภาพ {'>'} เลือก <strong>&quot;คัดลอกลิงก์ (Copy link)&quot;</strong>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            step: 7,
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
    ];

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
                    <WidgetOverviewCard
                        showLoginButton={!user}
                        showEnableButton={!!user && !config}
                        onClickEnable={handleEnable}
                        isLoading={isSaving}
                    >
                        <p className="text-gray-200 text-base leading-relaxed">
                            วิดเจ็ตนี้ช่วยให้ผู้ชมแลกแต้มช่องของคุณและส่ง URL ของรูปภาพ โดยมีระบบตรวจสอบความถูกต้องว่าเป็นไฟล์รูปภาพจริงและคัดกรองเนื้อหาที่ไม่เหมาะสม ก่อนปล่อยตกบนสตรีมและตอบกลับกรณีส่งผิด
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
                                <p className="text-sm text-muted-foreground">มีระบบ AI คอยคัดกรองรูปภาพก่อนแสดงผลเสมอ ป้องกันเนื้อหาที่ไม่เหมาะสมทั้งภาพโป๊เปลือยและความรุนแรง</p>
                            </div>
                        </div>
                    </WidgetOverviewCard>
                </TabsContent>

                <TabsContent value="quick-start">
                    <WidgetQuickStartCard>
                        <WidgetStepper>
                            <WidgetStepperItems items={quickStartSteps} />
                        </WidgetStepper>
                    </WidgetQuickStartCard>
                </TabsContent>

                <TabsContent value="settings">
                    <WidgetSettingsCard
                        widgetId={config?.widget?.id}
                        isEnabled={isEnabled}
                        onStatusChange={handleStatusChange}
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
                                    <p className="text-sm text-muted-foreground mt-2">
                                        คุณสามารถตั้งให้ภาพอยู่บนจอนานกี่วินาทีก่อนที่จะหายไป
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <Slider
                                            value={[displayDuration]}
                                            onValueChange={([v]) => setDisplayDuration(v)}
                                            min={1}
                                            max={20}
                                            step={1}
                                            className="flex-1 cursor-pointer"
                                        />
                                        <span className="text-sm tabular-nums w-16 text-right text-muted-foreground shrink-0">
                                            {displayDuration} วินาที
                                        </span>
                                    </div>
                                </div>

                                {/* Overlay URL */}
                                <div className="space-y-4">
                                    <OverlayUrlInput
                                        url={overlayUrl}
                                        onRefresh={() => setShowConfirmRefresh(true)}
                                        showRefresh={true}
                                    />
                                </div>

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
                                        <p className="text-sm text-muted-foreground">
                                            กำหนดข้อความที่จะส่งบนแชทของ Twitch เมื่อข้อความที่คนดูแลกแต้มมา ไม่ใช่ลิงก์ URL ที่ใช้งานได้
                                        </p>
                                        <ReplyMessageTextarea
                                            value={invalidMessage}
                                            onChange={(e) => setInvalidMessage(e)}
                                            placeholder="เช่น ลิงก์ที่ส่งมาไม่ถูกต้อง กรุณาส่งใหม่"
                                            rows={2}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ข้อความเมื่อไม่ใช่รูปภาพ</Label>
                                        <p className="text-sm text-muted-foreground">
                                            กำหนดข้อความที่จะส่งบนแชทของ Twitch เมื่อลิงก์ URL ที่คนดูแลกแต้มมา ไม่ใช่ลิงก์สำหรับรูปภาพ
                                        </p>
                                        <ReplyMessageTextarea
                                            value={notImageMessage}
                                            onChange={(e) => setNotImageMessage(e)}
                                            placeholder="เช่น ไฟล์ที่ส่งมาไม่ใช่รูปภาพ กรุณาส่ง URL ของรูปภาพ"
                                            rows={2}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ข้อความเมื่อเนื้อหาไม่เหมาะสม</Label>
                                        <p className="text-sm text-muted-foreground">
                                            กำหนดข้อความที่จะส่งบนแชทของ Twitch เมื่อลิงก์ URL รูปภาพที่คนดูแลกแต้มมา มีเนื้อหาที่ไม่เหมาะสม
                                        </p>
                                        <ReplyMessageTextarea
                                            value={containMatureMessage}
                                            onChange={(e) => setContainMatureMessage(e)}
                                            placeholder="เช่น รูปภาพมีเนื้อหาไม่เหมาะสม ไม่สามารถแสดงได้"
                                            rows={2}
                                            disabled={!enabledModeration}
                                        />
                                    </div>
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
