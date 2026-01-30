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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useUser } from "@/components/user-context";
import { cn } from "@/lib/utils";
import { Check, Copy, Eye, EyeOff, Info, MessageSquare, Music, Play, RefreshCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
    const [showUrl, setShowUrl] = useState(false);
    const [showConfirmReveal, setShowConfirmReveal] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showConfirmRefresh, setShowConfirmRefresh] = useState(false);
    const [copied, setCopied] = useState(false);

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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const overlayUrl = typeof window !== 'undefined' && user
        ? `${window.location.origin}/overlays/first-word/${user.id}${config?.overlay_key ? `?key=${config.overlay_key}` : ''}`
        : "";

    const handleCopyUrl = async () => {
        if (!overlayUrl) return;
        try {
            await navigator.clipboard.writeText(overlayUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

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
        <div className="container mx-auto py-10 flex justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            ตั้งค่า Greeting Message
                        </CardTitle>
                        <Switch
                            checked={isEnabled}
                            onCheckedChange={handleSwitchChange}
                        />
                    </div>
                    <CardDescription>
                        กำหนดข้อความที่จะส่งหาผู้ใช้งานใหม่
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Overlay URL</Label>
                        <div className="relative">
                            <Input
                                type={showUrl ? "text" : "password"}
                                value={overlayUrl}
                                readOnly
                                onClick={handleCopyUrl}
                                className="pr-20 cursor-pointer font-mono text-sm"
                            />
                            <div className="absolute right-0 top-0 h-full flex items-center pr-2 gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-transparent"
                                    onClick={() => {
                                        if (showUrl) {
                                            setShowUrl(false);
                                        } else {
                                            setShowConfirmReveal(true);
                                        }
                                    }}
                                >
                                    {showUrl ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-transparent"
                                    onClick={() => setShowConfirmRefresh(true)}
                                >
                                    <RefreshCcw className="h-4 w-4 text-muted-foreground" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-transparent"
                                    onClick={handleCopyUrl}
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Copy className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>
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
                            <Label htmlFor="audio_file">ไฟล์เสียง</Label>
                            {config?.audio_key && !audioFile ? (
                                <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-secondary rounded-md">
                                            <Music className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {config.audio_key.split('/').pop()}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                ไฟล์เสียงปัจจุบัน
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        เปลี่ยนไฟล์ใหม่
                                    </Button>
                                </div>
                            ) : null}

                            <div className={cn("space-y-2 animated fadeIn", config?.audio_key && !audioFile ? "hidden" : "")}>
                                <Input
                                    ref={fileInputRef}
                                    id="audio_file"
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setAudioFile(e.target.files[0]);
                                        }
                                    }}
                                />
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-muted-foreground">
                                        อัปโหลดไฟล์เสียงที่จะเล่นเมื่อมีผู้ใช้งานใหม่ทักทายเข้ามา
                                    </p>
                                    {config?.audio_key && audioFile && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setAudioFile(null);
                                                // Reset input value if needed, though react state is source of truth for our logic
                                                if (fileInputRef.current) fileInputRef.current.value = "";
                                            }}
                                            className="h-auto p-0 text-muted-foreground hover:text-foreground"
                                        >
                                            ยกเลิก
                                        </Button>
                                    )}
                                </div>
                            </div>
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

            <AlertDialog open={showConfirmReveal} onOpenChange={setShowConfirmReveal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>คุณต้องการแสดง Overlay URL หรือไม่?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Overlay URL เปรียบเสมือนรหัสผ่านสำหรับสตรีมของคุณ หากหลุดออกไป ผู้อื่นอาจสามารถส่งข้อความขี้นหน้าจอสตรีมของคุณได้โดยไม่ได้รับอนุญาต
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction onClick={() => setShowUrl(true)}>
                            แสดง URL
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
                        <AlertDialogAction onClick={handleRefreshKey}>
                            ยืนยันการรีเซ็ต
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    );
}
