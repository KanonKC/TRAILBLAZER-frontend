"use client"

import { Button } from "@/components/ui/button";
import { WidgetStatusControl } from "@/components/widget/WidgetStatusControl";
import { WidgetTestControl } from "@/components/widget/WidgetTestControl";
import { MaxPerkSelector } from "@/app/dashboard/widgets/random-dbd-perk/_components/MaxPerkSelector";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/components/user-context";
import { PerkConfigItem } from "./PerkConfigItem";
import { cn } from "@/lib/utils";
import { Dices, Gift, Play, ChevronDown, ExternalLink } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChannelRewardSelector } from "@/components/widget/ChannelRewardSelector";
import { useEffect, useState } from "react";
import {
    enableRandomDbdPerk,
    updateRandomDbdPerkConfig,
    testRandomDbdPerk,
    type RandomDbdPerkConfig,
    type RandomDbdPerkClass,
    PERKS_PER_PAGE
} from "@/services/randomDbdPerk.service";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteWidget } from "@/services/widget.service";
import { getTwitchChannelRewards, type TwitchCustomReward } from "@/services/twitch.service";
import RandomFormatInfo from "@/app/dashboard/widgets/random-dbd-perk/_components/RandomFormatInfo";
import { tbToast } from "@/utils/tbToast";

import WidgetOverviewCard from "@/components/widget/widget-tab-card/WidgetOverviewCard";
import WidgetQuickStartCard from "@/components/widget/widget-tab-card/WidgetQuickStartCard";
import WidgetSettingsCard from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCard";
import WidgetSettingsCardContent from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardContent";
import WidgetSettingsCardFooter from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardFooter";
import { DeleteWidgetButton } from "@/components/button/DeleteWidgetButton";
import { SaveWidgetButton } from "@/components/button/SaveWidgetButton";
import { WidgetStepper } from "@/components/widget/WidgetStepper/WidgetStepper";
import WidgetStepperItems from "@/components/widget/WidgetStepper/WidgetStepperItems/WidgetStepperItems";
import WidgetEnabledBadge from "@/components/widget/WidgetEnabledBadge";

export function RandomDbdPerkWidgetClient({ initialConfig }: { initialConfig: RandomDbdPerkConfig | null }) {
    const { user, isLoading: isUserLoading } = useUser();
    const [config, setConfig] = useState<RandomDbdPerkConfig | null>(initialConfig);
    const [isEnabled, setIsEnabled] = useState(initialConfig?.widget?.enabled ?? false);
    const [isSaving, setIsSaving] = useState(false);

    // showConfirmDelete is no longer needed as DeleteWidgetButton handles it? 
    // Wait, usually the button handles the UI but we pass the logic.
    // If DeleteWidgetButton has built-in dialog, we don't need local state for it.
    // Assuming yes based on ClipShoutout refactor.

    const [activeTab, setActiveTab] = useState(initialConfig ? "settings" : "overview");

    // Local state for classes to handle edits before saving
    const [perkClasses, setPerkClasses] = useState<RandomDbdPerkClass[]>(initialConfig?.classes || []);
    const [rewards, setRewards] = useState<TwitchCustomReward[]>([]);
    const [isRewardsLoading, setIsRewardsLoading] = useState(false);

    const [survivorUnit, setSurvivorUnit] = useState<"perk" | "page">("perk");
    const [killerUnit, setKillerUnit] = useState<"perk" | "page">("perk");
    const [wizardType, setWizardType] = useState<"survivor" | "killer">("survivor");

    useEffect(() => {
        const savedSurvivorUnit = localStorage.getItem("random-dbd-perk-unit-preference-survivor");
        if (savedSurvivorUnit === "perk" || savedSurvivorUnit === "page") {
            setSurvivorUnit(savedSurvivorUnit);
        }

        const savedKillerUnit = localStorage.getItem("random-dbd-perk-unit-preference-killer");
        if (savedKillerUnit === "perk" || savedKillerUnit === "page") {
            setKillerUnit(savedKillerUnit);
        }
    }, []);

    const handleSurvivorUnitChange = (val: "perk" | "page") => {
        setSurvivorUnit(val);
        localStorage.setItem("random-dbd-perk-unit-preference-survivor", val);
    };

    const handleKillerUnitChange = (val: "perk" | "page") => {
        setKillerUnit(val);
        localStorage.setItem("random-dbd-perk-unit-preference-killer", val);
    };

    useEffect(() => {
        if (!user) return;
        const fetchRewards = async () => {
            setIsRewardsLoading(true);
            try {
                const data = await getTwitchChannelRewards({ userInputRequired: false });
                setRewards(data);
            } catch (error) {
                console.error("Failed to fetch rewards", error);
            } finally {
                setIsRewardsLoading(false);
            }
        };
        fetchRewards();
    }, [user]);



    const handleEnable = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const data = await enableRandomDbdPerk(true);
            if (data) {
                tbToast.success({ title: "เปิดใช้งานสำเร็จ" });
                setConfig(data);
                setIsEnabled(data.widget?.enabled ?? false);
                setPerkClasses(data.classes || []);
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
                setPerkClasses([]);
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
            const updated = await updateRandomDbdPerkConfig({
                classes: perkClasses,
            });

            if (updated) {
                tbToast.success({ title: "บันทึกการตั้งค่าสำเร็จ" });
                setConfig(updated);
                setPerkClasses(updated.classes);
            }
        } catch (error) {
            console.error("Failed to update classes", error);
            tbToast.error({ title: "ไม่สามารถบันทึกการตั้งค่าได้" });
        } finally {
            setIsSaving(false);
        }
    }

    const updatePerkClass = (index: number, field: keyof RandomDbdPerkClass, value: string | number | boolean | null) => {
        const newClasses = [...perkClasses];
        newClasses[index] = { ...newClasses[index], [field]: value };

        // Auto-enable if changing other fields (like reward ID), 
        // but verify we aren't explicitly setting 'enabled'
        if (field !== 'enabled') {
            newClasses[index].enabled = true;
        }
        setPerkClasses(newClasses);
    };

    const [isTesting, setIsTesting] = useState(false);

    const handleTest = async (type: 'survivor' | 'killer') => {
        if (!user || isTesting) return;

        const targetClass = perkClasses.find(c => c.type === type && c.enabled);
        let rewardId = targetClass?.twitch_reward_id;

        if (!rewardId) {
            const anyClass = perkClasses.find(c => c.type === type && c.twitch_reward_id);
            rewardId = anyClass?.twitch_reward_id;
        }

        if (!rewardId) {
            console.warn(`No reward ID found for ${type} test`);
            rewardId = "test-reward-id-" + type;
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
                    user_input: "",
                    status: "unfulfilled",
                    reward: {
                        id: rewardId,
                        title: `Test ${type === 'survivor' ? 'Survivor' : 'Killer'} Perk`,
                        cost: 1,
                        prompt: ""
                    },
                    redeemed_at: new Date().toISOString()
                }
            };

            await testRandomDbdPerk(mockEvent);
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
            title: "เลือกประเภท Perk",
            description: (
                <div className="space-y-3">
                    <p className="text-sm text-white/70">
                        เลือกประเภท Perk ที่ต้องการใช้งาน
                    </p>
                    <p className="text-sm text-white/70 italic">
                        * คุณยังสามารถเลือกประเภท Perk เพิ่มเติมได้ในภายหลังที่หน้า Settings
                    </p>
                    <RadioGroup
                        value={wizardType}
                        onValueChange={(val) => setWizardType(val as "survivor" | "killer")}
                        className="flex gap-4"
                    >
                        <div className={cn(
                            "flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition-colors w-full",
                            wizardType === "survivor" ? "bg-blue-500/10 border-blue-500/50" : "bg-transparent border-white/10 hover:bg-white/5"
                        )}>
                            <RadioGroupItem value="survivor" id="r-survivor" />
                            <Label htmlFor="r-survivor" className="cursor-pointer flex-1 text-blue-400 font-medium">Survivor</Label>
                        </div>
                        <div className={cn(
                            "flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition-colors w-full",
                            wizardType === "killer" ? "bg-red-500/10 border-red-500/50" : "bg-transparent border-white/10 hover:bg-white/5"
                        )}>
                            <RadioGroupItem value="killer" id="r-killer" />
                            <Label htmlFor="r-killer" className="cursor-pointer flex-1 text-red-400 font-medium">Killer</Label>
                        </div>
                    </RadioGroup>
                </div>
            )
        },
        {
            step: 3,
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
                                value={perkClasses.find(c => c.type === wizardType)?.twitch_reward_id || null}
                                onValueChange={(val) => {
                                    const index = perkClasses.findIndex(c => c.type === wizardType);
                                    if (index !== -1) {
                                        updatePerkClass(index, 'twitch_reward_id', val);
                                    }
                                }}
                                rewards={rewards}
                                isLoading={isRewardsLoading}
                                placeholder="เลือก Reward เพื่อใช้ในการสุ่ม..."
                            />
                        </div>

                    </div>
                </div>
            )
        },
        {
            step: 4,
            title: "กำหนดจำนวน Perk ที่จะสุ่ม",
            description: (
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">สามารถกำหนดจำนวน Perk ที่ต้องการสุ่มมากที่สุดได้ เพื่อไม่ให้มีจำนวนมากเกินที่คุณมี</p>
                    <p className="text-sm text-white/70 italic">
                        * คุณต้องนับจำนวน Perk หรือจำนวนหน้าของ Perk ที่คุณมีในเกมเอง
                    </p>
                    <div className="border p-4 rounded-xl bg-muted/20">
                        {(() => {
                            const currentLimitClass = perkClasses.find(c => c.type === wizardType);
                            const totalPerks = wizardType === 'killer' ? (config?.totalKillerPerks || 0) : (config?.totalSurvivorPerks || 0);
                            const unit = wizardType === 'survivor' ? survivorUnit : killerUnit;

                            const maxValue = unit === 'perk' ? totalPerks : Math.ceil(totalPerks / PERKS_PER_PAGE);
                            const effectiveMaxSize = Math.min(currentLimitClass?.maximum_random_size || 0, totalPerks);
                            const currentValue = unit === 'perk' ? effectiveMaxSize : Math.ceil(effectiveMaxSize / PERKS_PER_PAGE);

                            return (
                                <MaxPerkSelector
                                    maxValue={maxValue}
                                    currentValue={currentValue}
                                    unit={unit}
                                    onUnitChange={wizardType === 'survivor' ? handleSurvivorUnitChange : handleKillerUnitChange}
                                    onCountChange={(val) => {
                                        let newValue = val;
                                        if (unit === 'page') {
                                            newValue = val * PERKS_PER_PAGE;
                                        }
                                        if (newValue > totalPerks) newValue = totalPerks;

                                        const index = perkClasses.findIndex(c => c.type === wizardType);
                                        if (index !== -1) {
                                            updatePerkClass(index, 'maximum_random_size', newValue);
                                        }
                                    }}
                                />
                            );
                        })()}
                    </div>
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
                        <li>ต้องมีข้อความแสดงผลการสุ่มขึ้นมาบนช่องแชท Twitch ของคุณ</li>
                    </ol>
                    <WidgetTestControl
                        isSaving={isSaving}
                        isTesting={isTesting}
                        onSave={handleSave}
                        onTest={() => handleTest(wizardType)}
                        canTest={!!perkClasses.find(c => c.type === wizardType)?.twitch_reward_id}
                    />
                    <RandomFormatInfo />
                </div>
            )
        },
        {
            step: 6,
            title: "การตั้งค่าเพิ่มเติม",
            description: (
                <div className="space-y-3">
                    <p className="text-sm text-white/70">
                        คุณสามารถจัดการ Perk ที่ไม่ต้องการให้สุ่ม หรือตั้งค่าขั้นสูงได้ที่แท็บ Settings
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
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <Dices className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold">Random DBD Perk</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    สุ่ม Perk Dead by Daylight สำหรับ Survivor และ Killer ผ่านการแลกแต้มช่อง หรือคำสั่งแชท
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
                            วิดเจ็ตนี้ช่วยให้ผู้ชมใช้แต้มช่องของคุณ เพื่อสุ่ม Perk โดยแยกการตั้งค่าระหว่าง Survivor และ Killer ได้อย่างอิสระ
                            พร้อมระบบตอบกลับอัตโนมัติ
                        </p>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-500 mb-3">
                                    <Dices className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold mb-1">Randomizer</h3>
                                <p className="text-sm text-muted-foreground">สุ่มได้ทั้งแบบราย Perk หรือแบบหน้า พร้อมระบบจำกัดจำนวนให้ตรงกับที่คุณมีในเกม</p>
                            </div>
                            <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                <div className="p-2 w-fit rounded-lg bg-purple-500/10 text-purple-500 mb-3">
                                    <Gift className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold mb-1">Channel Points</h3>
                                <p className="text-sm text-muted-foreground">เชื่อมต่อกับแต้มช่องของ Twitch ได้โดยตรง</p>
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
                            <RandomFormatInfo />
                             {perkClasses.map((item, index) => (
                                <PerkConfigItem
                                    key={item.id || index}
                                    item={item}
                                    index={index}
                                    updatePerkClass={updatePerkClass}
                                    totalPerks={item.type === 'killer' ? (config?.totalKillerPerks || 0) : (config?.totalSurvivorPerks || 0)}
                                    unit={item.type === 'survivor' ? survivorUnit : killerUnit}
                                    onUnitChange={item.type === 'survivor' ? handleSurvivorUnitChange : handleKillerUnitChange}
                                />
                            ))}
                        </WidgetSettingsCardContent>
                        <WidgetSettingsCardFooter>
                            <DeleteWidgetButton
                                onDelete={handleDelete}
                                isLoading={isSaving}
                            />
                            <div className="flex gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" disabled={isTesting}>
                                            {isTesting ? "Testing..." : (
                                                <>
                                                    <Play className="mr-2 h-4 w-4" />
                                                    Test
                                                    <ChevronDown className="ml-2 h-3 w-3 opacity-50" />
                                                </>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleTest('survivor')}>
                                            Test Survivor
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleTest('killer')}>
                                            Test Killer
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <SaveWidgetButton
                                    onSave={handleSave}
                                    isLoading={isSaving}
                                />
                            </div>
                        </WidgetSettingsCardFooter>
                    </WidgetSettingsCard>
                </TabsContent>
            </Tabs>
        </div>
    );
}
