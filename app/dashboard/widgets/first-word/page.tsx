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
import { WidgetStatusControl } from "@/components/first-word/WidgetStatusControl";
import { ReplyMessageInput } from "@/components/first-word/ReplyMessageInput";
import { WidgetTestControl } from "@/components/first-word/WidgetTestControl";
import { OverlayUrlInput } from "@/components/first-word/OverlayUrlInput";
import { AudioFileUploader } from "@/components/first-word/AudioFileUploader";
import { BotProfileSelector, type BotProfileType } from "@/components/first-word/BotProfileSelector";
import { OBSSetupHelp } from "@/components/first-word/OBSSetupHelp";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TwitchLoginButton } from "@/components/twitch-login-button";
import { useUser } from "@/components/user-context";
import { cn } from "@/lib/utils";
import { AlertTriangle, Check, ExternalLink, Info, MessageSquare, Music, Play, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

import {
    deleteFirstWordConfig,
    enableFirstWord,
    getFirstWordConfig,
    testFirstWordAudio,
    updateFirstWordConfig,
    uploadFirstWordAudio,
    refreshFirstWordOverlayKey,
    type FirstWordConfig
} from "@/services/firstWord.service";



export default function FirstWordWidgetPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const [config, setConfig] = useState<FirstWordConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [replyMessage, setReplyMessage] = useState("");
    const [replyMessageError, setReplyMessageError] = useState<string | null>(null);
    const [isEnabled, setIsEnabled] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [botProfile, setBotProfile] = useState<string>(user?.twitchId || "");

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showConfirmRefresh, setShowConfirmRefresh] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    // ... (rest of state)

    const handleDelete = async () => {
        setIsSaving(true);
        try {
            const success = await deleteFirstWordConfig();
            if (success) {
                setConfig(null);
                setReplyMessage("");
                setIsEnabled(false);
                setAudioFile(null);
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
            const data = await refreshFirstWordOverlayKey();
            if (data) {
                setConfig(data);
                // toast success
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
        ? `${window.location.origin}/overlays/first-word/${user.id}${config?.overlay_key ? `?key=${config.overlay_key}` : ''}`
        : "";



    useEffect(() => {
        if (isUserLoading) return;
        if (!user) {
            setIsLoading(false);
            return;
        }

        const fetchConfig = async () => {
            try {
                const data = await getFirstWordConfig();
                if (data) {
                    setConfig(data);
                    setReplyMessage(data.reply_message || "");
                    setIsEnabled(data.enabled ?? true);
                    setBotProfile(data.twitch_bot_id || "default");
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
            const data = await enableFirstWord(user.twitchId, user.id);
            console.log('enable', data);
            if (data) {
                setConfig(data);
                setReplyMessage(data.reply_message || "");
                setIsEnabled(data.enabled ?? true);
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

        // Validation
        const result = replyMessageSchema.safeParse(replyMessage);
        if (!result.success) {
            setReplyMessageError(result.error.issues[0].message);
            return;
        }

        setIsSaving(true);
        try {
            const updated = await updateFirstWordConfig({
                reply_message: replyMessage,
                twitch_bot_id: botProfile === "default" ? null : botProfile
            });

            if (updated) {
                setConfig(updated);

                if (audioFile) {
                    const audioSuccess = await uploadFirstWordAudio(audioFile);
                    if (audioSuccess) {
                        setAudioFile(null);
                        // Refresh config to get new audio key
                        const newConfig = await getFirstWordConfig();
                        if (newConfig) {
                            setConfig(newConfig);
                        }
                    }
                }
                // Optionally show toast
            }
        } catch (error) {
            console.error("Failed to update", error);
        } finally {
            setIsSaving(false);
        }
    }

    const handleTestAudio = async () => {
        if (!user || isTesting) return;

        setIsTesting(true);
        const dummyUser = `TestUser_${Math.random().toString().substring(2, 8)}`
        try {
            const mockEvent = {
                subscription: {
                    status: "enabled"
                },
                event: {
                    broadcaster_user_id: user.twitchId,
                    broadcaster_user_login: user.username,
                    broadcaster_user_name: user.displayName,
                    chatter_user_id: "0", // Mock ID
                    chatter_user_login: dummyUser.toLowerCase(),
                    chatter_user_name: dummyUser,
                    message_id: crypto.randomUUID(),
                    message: {
                        text: "Test Message",
                        fragments: [
                            {
                                type: "text",
                                text: "Test Message",
                                cheermote: null,
                                emote: null,
                                mention: null
                            }
                        ]
                    },
                    color: "#FF0000",
                    badges: [],
                    message_type: "text",
                    cheer: null,
                    reply: null,
                    channel_points_custom_reward_id: null,
                    source_broadcaster_user_id: null,
                    source_broadcaster_user_login: null,
                    source_broadcaster_user_name: null,
                    source_message_id: null,
                    source_badges: null
                }
            };

            await testFirstWordAudio(mockEvent);

            // toast({
            //     title: "Test Sent",
            //     description: "Audio trigger event has been sent.",
            // });
        } catch (error) {
            console.error("Test failed:", error);
            // toast({
            //     title: "Test Failed",
            //     description: "Failed to send test event.",
            //     variant: "destructive",
            // });
        } finally {
            setIsTesting(false);
        }
    };

    const handleSwitchChange = async (checked: boolean) => {
        setIsEnabled(checked);
        if (!config) return;

        try {
            const updated = await updateFirstWordConfig({
                enabled: checked
            });

            if (updated) {
                setConfig(updated);
            } else {
                // Revert if failed
                setIsEnabled(!checked);
            }
        } catch (error) {
            console.error("Failed to update status", error);
            setIsEnabled(!checked);
        }
    }

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
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold">Greeting Message</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    ต้อนรับผู้ชมใหม่โดยอัตโนมัติด้วยข้อความทักทายและเสียงเอฟเฟกต์ที่คุณกำหนดเอง
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
                                อธิบายความสามารถและการทำงานของวิดเจ็ตตัวนี้
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-200 text-base leading-relaxed">
                                อยากให้ช่องคึกคัก ต้องเริ่มที่การทักทาย! วิดเจ็ตนี้จะช่วยต้อนรับผู้ชมหน้าใหม่ทันทีที่เขาพิมพ์แชทครั้งแรก ไม่ต้องกลัวหลุดโฟกัสตอนเล่นเกม หรือคุยเพลินจนลืมทัก ช่วยสร้างความประทับใจแรกสุดปัง ให้ทุกคนรู้สึกอบอุ่นเหมือนเพื่อนสนิท แถมยังตั้งค่าข้อความและเสียงเอฟเฟกต์กวนๆ ได้ตามสไตล์คุณ!
                            </p>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                    <div className="p-2 w-fit rounded-lg bg-blue-500/10 text-blue-500 mb-3">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold mb-1">Auto Greeting</h3>
                                    <p className="text-sm text-muted-foreground">ต้อนรับผู้ชมใหม่โดยอัตโนมัติเมื่อพวกเขาพิมพ์ข้อความแรก</p>
                                </div>
                                <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                    <div className="p-2 w-fit rounded-lg bg-purple-500/10 text-purple-500 mb-3">
                                        <Music className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold mb-1">Sound Alerts</h3>
                                    <p className="text-sm text-muted-foreground">เล่นเสียงเอฟเฟกต์เพื่อประกาศผู้มาเยือนคนใหม่</p>
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
                                    title: "ใส่ข้อความ",
                                    description: (
                                        <div className="space-y-3">
                                            <p className="text-sm text-white/70">ใส่ข้อความเพื่อทักทายคนดูที่เข้ามาใหม่บน Twitch โดยคุณสามารถใช้ตัวแปรที่กำหนดให้ใส่เข้าไปในกล่องข้อความด้วย เพื่อให้เมื่อข้อความแสดงขึ้นมาแล้ว มันจะเปลี่ยนไปตามคนดูที่เข้ามา เช่น ชื่อของคนดูที่เข้ามาใหม่</p>
                                            <ReplyMessageInput
                                                hideLabel
                                                value={replyMessage}
                                                onChange={handleReplyMessageChange}
                                                error={replyMessageError}
                                                variables={[
                                                    {
                                                        variable: "{{user_name}}",
                                                        description: "ชื่อที่แสดงผลของผู้ทักทาย",
                                                        example: "User123"
                                                    }
                                                ]}
                                            />
                                        </div>
                                    )
                                },
                                {
                                    step: 3,
                                    title: "ใส่เสียง",
                                    description: (
                                        <div className="space-y-3">
                                            <p className="text-sm text-white/70">เล่นเสียงนี้เมื่อมีคนดูเข้ามาพิมพ์ทักทายคุณ การอัปโหลดเสียงในขั้นตอนนี้จะยังไม่ทำให้สตรีมของคุณมีเสียงในทันที</p>
                                            <AudioFileUploader
                                                currentFileName={config?.audio_key}
                                                selectedFile={audioFile}
                                                onFileSelect={setAudioFile}
                                                className="text-white"
                                                inputClassName="bg-transparent border-white/20 text-white file:text-white file:bg-white/10 file:border-0 file:mr-4 file:px-4 file:py-2 file:rounded-md file:text-sm file:font-semibold hover:file:bg-white/20"
                                                hideLabel
                                            />
                                        </div>
                                    )
                                },
                                {
                                    step: 4,
                                    title: "นำ Overlay สำหรับเสียงไปใส่บน OBS",
                                    description: (
                                        <div className="space-y-3">
                                            <p className="text-sm text-white/70">เพื่อให้การสตรีมของคุณมีเสียงออกมาได้ คุณจำเป็นต้องนำลิงก์ Overlay URL ด้านล่างไปใส่บนโปรแกรม OBS ก่อน</p>
                                            <p className="text-sm text-white/70 italic">* คุณสามารถข้ามขั้นตอนนี้ได้ หากไม่ต้องการใช้เสียง</p>
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
                                        <WidgetTestControl
                                            isSaving={isSaving}
                                            isTesting={isTesting}
                                            onSave={handleSave}
                                            onTest={handleTestAudio}
                                            canTest={!!(config?.audio_key || config?.reply_message)}
                                        />
                                    )
                                },
                                {
                                    step: 6,
                                    title: "การตั้งค่าเพิ่มเติม",
                                    description: (
                                        <div className="space-y-3">
                                            <p className="text-sm text-white/70">
                                                Quick Start เป็นเพียงการตั้งค่าเบื้องต้นเท่านั้น คุณสามารถปรับแต่งการตั้งค่าอื่นๆ เพิ่มเติมได้ที่เมนู Settings
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
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 justify-between">
                                <span className="flex items-center gap-2">
                                    <Info className="w-5 h-5 text-blue-500" />
                                    Settings
                                </span>
                                <Switch
                                    checked={isEnabled}
                                    onCheckedChange={handleSwitchChange}
                                />
                            </CardTitle>
                            <CardDescription>
                                ปรับแต่งการตั้งค่าสำหรับวิดเจ็ต
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {/* Message Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b pb-2">
                                    <MessageSquare className="w-5 h-5 text-blue-500" />
                                    <h3 className="text-lg font-semibold">ข้อความ</h3>
                                </div>
                                <div className="">
                                    <BotProfileSelector
                                        value={botProfile}
                                        onValueChange={setBotProfile}
                                    />
                                </div>
                                <ReplyMessageInput
                                    value={replyMessage}
                                    onChange={handleReplyMessageChange}
                                    variant="default"
                                    error={replyMessageError}
                                    variables={[
                                        {
                                            variable: "{{user_name}}",
                                            description: "ชื่อที่แสดงผลของผู้ทักทาย",
                                            example: "User123"
                                        }
                                    ]}
                                />
                            </div>

                            {/* Audio Section */}
                            <div className="space-y-4 ">
                                <div className="flex items-center gap-2 border-b pb-2">
                                    <Music className="w-5 h-5 text-purple-500" />
                                    <h3 className="text-lg font-semibold">เสียงและโอเวอร์เลย์</h3>
                                </div>
                                <div className="">
                                    <AudioFileUploader
                                        currentFileName={config?.audio_key}
                                        selectedFile={audioFile}
                                        onFileSelect={setAudioFile}
                                        className="text-white"
                                        inputClassName="bg-transparent border-white/20 text-white file:text-white file:bg-white/10 file:border-0 file:mr-4 file:px-4 file:py-2 file:rounded-md file:text-sm file:font-semibold hover:file:bg-white/20"
                                    />
                                </div>
                                <OverlayUrlInput
                                    url={overlayUrl}
                                    onRefresh={() => setShowConfirmRefresh(true)}
                                    showRefresh={true}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t px-6 py-4">
                            <Button
                                variant="destructive"
                                onClick={() => setShowConfirmDelete(true)}
                                disabled={isSaving}
                            >
                                ลบวิดเจ็ต
                            </Button>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleTestAudio} disabled={isTesting && !config?.audio_key && !config?.reply_message}>
                                    {isTesting ? (
                                        <>Testing...</>
                                    ) : (
                                        <>
                                            <Play className="mr-2 h-4 w-4" />
                                            Test
                                        </>
                                    )}
                                </Button>
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
                            การลบวิดเจ็ตจะทำให้การตั้งค่าทั้งหมดหายไป และวิดเจ็ตจะถูกปิดการใช้งาน คุณจะต้องเปิดใช้งานใหม่อีกครั้งหากต้องการใช้งาน
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
        </div >
    );
}
