"use client"

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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetStatusControl } from "@/components/widget/WidgetStatusControl";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TwitchLoginButton } from "@/components/twitch-login-button";
import { useUser } from "@/components/user-context";
import { PerkConfigItem } from "./perk-config-item";
import { cn } from "@/lib/utils";
import { Dices, Gift, Info, Trash2, Play, ChevronDown, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import {
    deleteRandomDbdPerkConfig,
    enableRandomDbdPerk,
    getRandomDbdPerkConfig,
    updateRandomDbdPerkConfig,
    testRandomDbdPerk,
    type RandomDbdPerkConfig,
    type RandomDbdPerkClass
} from "@/services/randomDbdPerk.service";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateWidgetEnabled } from "@/services/widget.service";
import { getTwitchChannelRewards, type TwitchCustomReward } from "@/services/twitch.service";


export default function RandomDbdPerkWidgetPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const [config, setConfig] = useState<RandomDbdPerkConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEnabled, setIsEnabled] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    // Local state for classes to handle edits before saving
    const [perkClasses, setPerkClasses] = useState<RandomDbdPerkClass[]>([]);
    const [rewards, setRewards] = useState<TwitchCustomReward[]>([]);
    const [isRewardsLoading, setIsRewardsLoading] = useState(false);

    const [survivorUnit, setSurvivorUnit] = useState<"perk" | "page">("perk");
    const [killerUnit, setKillerUnit] = useState<"perk" | "page">("perk");

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
                const data = await getRandomDbdPerkConfig();
                if (data) {
                    setConfig(data);
                    setIsEnabled(data.widget?.enabled ?? false);
                    setPerkClasses(data.classes || []);
                    setActiveTab("settings");
                } else {
                    setConfig(null);
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
            const data = await enableRandomDbdPerk(true);
            if (data) {
                setConfig(data);
                setIsEnabled(data.widget?.enabled ?? false);
                setPerkClasses(data.classes || []);
                setActiveTab("quick-start");
            }
        } catch (error) {
            console.error("Failed to enable", error);
        } finally {
            setIsSaving(false);
        }
    }

    const handleDelete = async () => {
        setIsSaving(true);
        try {
            const success = await deleteRandomDbdPerkConfig();
            if (success) {
                setConfig(null);
                setIsEnabled(false);
                setPerkClasses([]);
                setActiveTab("overview");
            }
        } catch (error) {
            console.error("Failed to delete", error);
        } finally {
            setIsSaving(false);
            setShowConfirmDelete(false);
        }
    };

    const handleSwitchChange = async (checked: boolean) => {
        if (!config || !config.widget) return;
        setIsEnabled(checked);

        try {
            const success = await updateWidgetEnabled(config.widget.id, checked);

            if (success) {
                setConfig(prev => prev ? {
                    ...prev,
                    widget: {
                        ...prev.widget,
                        is_enabled: checked
                    }
                } : null);
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
            const updated = await updateRandomDbdPerkConfig({
                classes: perkClasses
            });

            if (updated) {
                setConfig(updated);
                setPerkClasses(updated.classes);
            }
        } catch (error) {
            console.error("Failed to update classes", error);
        } finally {
            setIsSaving(false);
        }
    }

    const updatePerkClass = (index: number, field: keyof RandomDbdPerkClass, value: any) => {
        const newClasses = [...perkClasses];
        newClasses[index] = { ...newClasses[index], [field]: value };
        setPerkClasses(newClasses);
    };

    const [isTesting, setIsTesting] = useState(false);

    const handleTest = async (type: 'survivor' | 'killer') => {
        if (!user || isTesting) return;

        // Find a config class that matches the requested type and has a reward ID to simulate a real scenario
        // If no such class exists, we can still test but ideally we use one that exists
        const targetClass = perkClasses.find(c => c.type === type && c.enabled);

        // Fallback or use a placeholder if no class found? 
        // We need a reward ID to match what the backend expects if it looks up logic by reward ID.
        // The backend looks up RandomDbdPerkClass by twitch_reward_id.
        // So we MUST use a reward ID that exists in our config, OR we add a proper error if none found.
        
        let rewardId = targetClass?.twitch_reward_id;
        
        // If no rewardId configured for this type, we can't really test the full flow as backend logic depends on finding the class by reward ID.
        // However, for testing purpose, maybe we should alert the user if they haven't set a reward ID yet.
        if (!rewardId) {
            // Try to find ANY class of this type to get a reward ID?
            const anyClass = perkClasses.find(c => c.type === type && c.twitch_reward_id);
            rewardId = anyClass?.twitch_reward_id;
        }

        if (!rewardId) {
            // Show error/toast? For now just log
            console.warn(`No reward ID found for ${type} test`);
            // We could proceed with a fake ID but backend might ignore it.
            // Let's assume we proceed with a dummy if none found, to at least trigger the event.
            // But realistically, user should configure it first.
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
                    user_id: user.twitchId, // Self redemption
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
                        <Dices className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold">Random DBD Perk</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    สุ่ม Perk Dead by Daylight สำหรับ Survivor และ Killer ผ่านการแลก Channel Points หรือคำสั่งแชท
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-500" />
                                Overview
                            </CardTitle>
                            <CardDescription>
                                ระบบสุ่ม Perk ที่เชื่อมต่อกับ Twitch Channel Points โดยตรง
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-200 text-base leading-relaxed">
                                วิดเจ็ตนี้ช่วยให้ผู้ชมของคุณสามารถใช้ Channel Points เพื่อสุ่ม Perk ในเกม Dead by Daylight ได้
                                ระบบจะตอบกลับในแชทพร้อมชื่อ Perk และรายละเอียด
                            </p>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                    <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-500 mb-3">
                                        <Dices className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold mb-1">Randomizer</h3>
                                    <p className="text-sm text-muted-foreground">สุ่ม Perk 1-4 อย่าง ตามที่คุณกำหนด</p>
                                </div>
                                <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                    <div className="p-2 w-fit rounded-lg bg-purple-500/10 text-purple-500 mb-3">
                                        <Gift className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold mb-1">Channel Points</h3>
                                    <p className="text-sm text-muted-foreground">เชื่อมต่อกับ Reward ID ของ Twitch ได้โดยตรง</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            {!user && (
                                <TwitchLoginButton className="w-full" />
                            )}
                            {user && !config && (
                                <Button onClick={handleEnable} disabled={isSaving} className="w-full">
                                    {isSaving ? "กำลังเปิดใช้งาน..." : "เปิดใช้งาน Widget"}
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="quick-start">
                    <Card className="bg-transparent border-none shadow-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Play className="w-5 h-5 text-green-500" />
                                Quick Start
                            </CardTitle>
                            <CardDescription className="text-white/70">
                                เริ่มต้นใช้งานได้ในไม่กี่นาที
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
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
                                    title: "สร้าง Channel Rewards บน Twitch",
                                    description: (
                                        <div className="space-y-3">
                                            <p className="text-sm text-white/70">
                                                ไปที่ <strong>Creator Dashboard &gt; Viewer Rewards &gt; Channel Points</strong> บน Twitch
                                                และสร้าง Custom Reward ใหม่สำหรับ Survivor หรือ Killer Perk
                                            </p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 gap-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 border-purple-500/50"
                                                onClick={() => window.open("https://dashboard.twitch.tv/viewer-rewards/channel-points/rewards", "_blank")}
                                            >
                                                ไปที่ Twitch Dashboard
                                                <ExternalLink className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    )
                                },
                                {
                                    step: 3,
                                    title: "ตั้งค่า Reward ใน Widget",
                                    description: (
                                        <div className="space-y-3">
                                            <p className="text-sm text-white/70">
                                                ไปที่แท็บ <strong>Settings</strong> ของ Widget นี้ แล้วเลือก Reward ที่คุณสร้างขึ้น
                                                ให้กับหมวดหมู่ Perk ที่ต้องการ (Survivor/Killer)
                                            </p>
                                            <Button
                                                variant="secondary"
                                                onClick={() => setActiveTab("settings")}
                                                className="bg-white/10 text-white hover:bg-white/20 border-0 gap-2"
                                            >
                                                ไปที่การตั้งค่า (Settings)
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )
                                },
                                {
                                    step: 4,
                                    title: "ทดสอบการทำงาน",
                                    description: (
                                        <div className="space-y-3">
                                            <p className="text-sm text-white/70">
                                                ทดลองกดปุ่มด้านล่างเพื่อจำลองการแลก Reward (คุณต้องตั้งค่า Reward ID ในขั้นตอนก่อนหน้าก่อน)
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => handleTest('survivor')} 
                                                    disabled={isTesting}
                                                    className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/50"
                                                >
                                                    {isTesting ? "Testing..." : (
                                                        <>
                                                            <Play className="mr-2 h-4 w-4" />
                                                            Test Survivor
                                                        </>
                                                    )}
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => handleTest('killer')} 
                                                    disabled={isTesting}
                                                    className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/50"
                                                >
                                                    {isTesting ? "Testing..." : (
                                                        <>
                                                            <Play className="mr-2 h-4 w-4" />
                                                            Test Killer
                                                        </>
                                                    )}
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
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 justify-between">
                                <span className="flex items-center gap-2">
                                    <Dices className="w-5 h-5 text-emerald-500" />
                                    Settings
                                </span>
                                <Switch
                                    checked={isEnabled}
                                    onCheckedChange={handleSwitchChange}
                                />
                            </CardTitle>
                            <CardDescription>
                                ตั้งค่า Channel Reward ID และจำนวน Perk ที่ต้องการสุ่ม
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm flex gap-3">
                                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold mb-1">วิธีการใช้งาน:</p>
                                    <p>
                                        นำ <strong>Reward ID</strong> จาก Twitch Channel Points ของคุณมากรอกในช่องด้านล่าง
                                        เมื่อผู้ชมแลกรางวัลนั้น บอทจะทำการสุ่ม Perk และตอบกลับในแชททันที
                                    </p>
                                </div>
                            </div>

                            {perkClasses.map((item, index) => (
                                <PerkConfigItem
                                    key={item.id || index}
                                    item={item}
                                    index={index}
                                    rewards={rewards}
                                    isLoading={isRewardsLoading}
                                    updatePerkClass={updatePerkClass}
                                    totalPerks={item.type === 'killer' ? (config?.totalKillerPerks || 0) : (config?.totalSurvivorPerks || 0)}
                                    unit={item.type === 'survivor' ? survivorUnit : killerUnit}
                                    onUnitChange={item.type === 'survivor' ? handleSurvivorUnitChange : handleKillerUnitChange}
                                />
                            ))}

                        </CardContent>
                        <CardFooter className="flex justify-between border-t px-6 py-4">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setShowConfirmDelete(true)}
                                disabled={isSaving}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                ลบวิดเจ็ต
                            </Button>
                            <div className="flex gap-2 ml-auto">
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
                                <Button onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>

            <AlertDialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>คุณต้องการลบวิดเจ็ตนี้หรือไม่?</AlertDialogTitle>
                        <AlertDialogDescription>
                            การลบวิดเจ็ตจะทำให้การตั้งค่าทั้งหมดหายไป และวิดเจ็ตจะถูกปิดการใช้งาน
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            ยืนยันการลบ
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
