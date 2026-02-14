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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TwitchLoginButton } from "@/components/twitch-login-button";
import { useUser } from "@/components/user-context";
import { PerkConfigItem } from "./perk-config-item";
import { cn } from "@/lib/utils";
import { AlertTriangle, Dices, Gift, Info, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
    deleteRandomDbdPerkConfig,
    enableRandomDbdPerk,
    getRandomDbdPerkConfig,
    updateRandomDbdPerkConfig,
    type RandomDbdPerkConfig,
    type RandomDbdPerkClass
} from "@/services/randomDbdPerk.service";
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

    useEffect(() => {
        if (!user) return;
        const fetchRewards = async () => {
            const data = await getTwitchChannelRewards();
            setRewards(data);
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
                setActiveTab("settings");
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
                <TabsList className={cn("grid w-full mb-4", config ? "grid-cols-2" : "grid-cols-1")}>
                    <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
                    {config && (
                        <TabsTrigger value="settings" className="cursor-pointer">Settings</TabsTrigger>
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
                                    updatePerkClass={updatePerkClass}
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
                            <Button onClick={handleSave} disabled={isSaving} className="ml-auto">
                                {isSaving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                            </Button>
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
