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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/components/user-context";
import { cn } from "@/lib/utils";
import { Check, Info, MessageSquare, Music, Play, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

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
    const [isEnabled, setIsEnabled] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [audioFile, setAudioFile] = useState<File | null>(null);

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showConfirmRefresh, setShowConfirmRefresh] = useState(false);

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
            }
        } catch (error) {
            console.error("Failed to enable", error);
        } finally {
            setIsSaving(false);
        }
    }

    const handleSave = async () => {
        if (!config) return;
        setIsSaving(true);
        try {
            const updated = await updateFirstWordConfig({
                reply_message: replyMessage
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
        try {
            const mockEvent = {
                subscription: {
                    status: "enabled"
                },
                event: {
                    broadcaster_user_id: user.twitchId,
                    broadcaster_user_login: user.username,
                    broadcaster_user_name: user.displayName,
                    chatter_user_id: "123456789", // Mock ID
                    chatter_user_login: "testuser",
                    chatter_user_name: "Test User",
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

    if (!user) {
        return (
            <div className="container mx-auto py-10 text-center">
                <p>Please login to configure widgets.</p>
            </div>
        )
    }

    if (!config) {
        return (
            <div className="container mx-auto py-10 flex justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            วิดเจ็ต Greeting Message
                        </CardTitle>
                        <CardDescription>
                            เปิดใช้งานวิดเจ็ต Greeting Message เพื่อตอบกลับผู้ใช้งานที่แชทเข้ามาครั้งแรกในสตรีมของคุณโดยอัตโนมัติ
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={handleEnable} disabled={isSaving}>
                            {isSaving ? "กำลังเปิดใช้งาน..." : "เปิดใช้งาน"}
                        </Button>
                    </CardFooter>
                </Card>
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
                    <h1 className="text-3xl font-bold">First Word Widget</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    Automatically welcome new chatters with a custom greeting and sound effect.
                </p>
            </div>

            <Tabs defaultValue="settings" className="w-full max-w-2xl">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
                    <TabsTrigger value="quick-start" className="cursor-pointer">Quick Start</TabsTrigger>
                    <TabsTrigger value="settings" className="cursor-pointer">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-500" />
                                Overview
                            </CardTitle>
                            <CardDescription>
                                Discover what the First Word Widget can do for your stream.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="aspect-video bg-muted rounded-xl flex items-center justify-center relative overflow-hidden group border">
                                <div className="text-center p-6">
                                    <Play className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
                                    <p className="text-muted-foreground font-medium">Video Overview</p>
                                    <p className="text-xs text-muted-foreground/70">Coming soon</p>
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                    <div className="p-2 w-fit rounded-lg bg-blue-500/10 text-blue-500 mb-3">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold mb-1">Auto Greeting</h3>
                                    <p className="text-sm text-muted-foreground">Automatically welcomes new chatters when they send their first message.</p>
                                </div>
                                <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                    <div className="p-2 w-fit rounded-lg bg-purple-500/10 text-purple-500 mb-3">
                                        <Music className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold mb-1">Sound Alerts</h3>
                                    <p className="text-sm text-muted-foreground">Play a custom sound effect to announce a new visitor.</p>
                                </div>
                            </div>
                        </CardContent>
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
                                Get up and running in minutes.
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
                                                value={replyMessage}
                                                onChange={setReplyMessage}
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

                                            <OverlayUrlInput
                                                url={overlayUrl}
                                                className="text-white"
                                                inputClassName="bg-transparent border-white/20 text-white"
                                                showRefresh={true}
                                                onRefresh={() => setShowConfirmRefresh(true)}
                                            />

                                            <ul className="text-sm text-white/70 list-disc pl-5 space-y-1 mt-2">
                                                <li>ไปที่โปรแกรม OBS จากนั้นไปที่ Sources {">"} Add Source {">"} Browser</li>
                                                <li>นำลิงก์ไปใส่ไว้ที่ช่อง URL</li>
                                                <li>กดติ๊กถูกที่ตัวเลือก Control audio via OBS จากนั้นกด OK</li>
                                                <li>ตามหาแทร็กเสียงของ Browser ที่เราตั้งค่าไปก่อนหน้า จากนั้นเลือก Audio Monitoring เป็นแบบ Monitor and Output</li>
                                            </ul>
                                        </div>
                                    )
                                },
                                {
                                    step: 5,
                                    title: "ทดสอบ",
                                    description: (
                                        <WidgetTestControl
                                            isSaving={isSaving}
                                            isTesting={isTesting}
                                            onSave={handleSave}
                                            onTest={handleTestAudio}
                                            canTest={!!(config?.audio_key || config?.reply_message)}
                                        />
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
                                    <div className="space-y-1 pt-1 flex-1">
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
                                Discover what the First Word Widget can do for your stream.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <OverlayUrlInput
                                    url={overlayUrl}
                                    onRefresh={() => setShowConfirmRefresh(true)}
                                    showRefresh={true}
                                />
                                <p className="text-xs text-muted-foreground">
                                    คลิกที่ช่องเพื่อคัดลอก URL แล้วนำไปใส่ใน Browser Source ของโปรแกรมสตรีม (OBS/Streamlabs)
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reply_message">ข้อความตอบกลับ</Label>
                                <Input
                                    id="reply_message"
                                    placeholder="ยินดีต้อนรับสู่สตรีมนะ {{user_name}}!"
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                />
                                <div className="flex items-center gap-2 pt-2">
                                    <p className="text-sm text-muted-foreground font-medium">
                                        ตัวแปรที่ใช้ได้:
                                    </p>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>คุณสามารถพิมพ์ตัวแปรเหล่านี้ลงในช่องข้อความ เพื่อให้ระบบแทนที่ด้วยข้อมูลจริงโดยอัตโนมัติ</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                                    <li><code className="bg-muted px-1 rounded">{"{{user_name}}"}</code> - ชื่อที่แสดงผลของผู้ทักทาย (เช่น "User123")</li>
                                    <li><code className="bg-muted px-1 rounded">{"{{user_login}}"}</code> - Twitch Username ของผู้ทักทาย (เช่น "user123")</li>
                                    <li><code className="bg-muted px-1 rounded">{"{{broadcaster_user_name}}"}</code> - ชื่อที่แสดงผลของช่อง (เช่น "Streamer")</li>
                                    <li><code className="bg-muted px-1 rounded">{"{{broadcaster_user_login}}"}</code> - Twitch Username ของช่อง (เช่น "streamer")</li>
                                    <li><code className="bg-muted px-1 rounded">{"{{message_text}}"}</code> - ข้อความที่พิมพ์มา</li>
                                    <li><code className="bg-muted px-1 rounded">{"{{color}}"}</code> - สีแชทของผู้ใช้งาน</li>
                                </ul>


                                <div className="space-y-2 pt-4 border-t">
                                    <AudioFileUploader
                                        currentFileName={config?.audio_key}
                                        selectedFile={audioFile}
                                        onFileSelect={setAudioFile}
                                    />
                                </div>
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
                                <Button variant="outline" onClick={handleTestAudio} disabled={isTesting && !config.audio_key && !config.reply_message}>
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
        </div>
    );
}
