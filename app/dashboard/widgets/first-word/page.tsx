"use client"

import { useEffect, useState } from "react";
import { useUser } from "@/components/user-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, MessageSquare, Eye, EyeOff, Copy, Check, Play } from "lucide-react";
import { Switch } from "@/components/ui/switch";
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

interface FirstWordConfig {
    id: string;
    twitch_id: string;
    owner_id: string;
    reply_message: string | null;
    enabled: boolean;
}

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
    const [copied, setCopied] = useState(false);
    const [isTesting, setIsTesting] = useState(false);

    const overlayUrl = typeof window !== 'undefined' && user ? `${window.location.origin}/overlays/first-word/${user.id}` : "";

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
                const res = await fetch("http://localhost:8080/api/v1/first-word", {
                    credentials: "include"
                });
                if (res.ok) {
                    const data = await res.json();
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
            const res = await fetch("http://localhost:8080/api/v1/first-word", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    twitch_id: user.twitchId,
                    owner_id: user.id,
                }),
                credentials: "include"
            });

            if (res.ok) {
                // Refresh config
                const configRes = await fetch("http://localhost:8080/api/v1/first-word", {
                    credentials: "include"
                });
                if (configRes.ok) {
                    const data = await configRes.json();
                    setConfig(data);
                    setReplyMessage(data.reply_message || "");
                    setIsEnabled(data.enabled ?? true);
                }
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
            const res = await fetch("http://localhost:8080/api/v1/first-word", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reply_message: replyMessage
                }),
                credentials: "include"
            });

            console.log(res);

            if (res.ok) {
                console.log("OK")
                const updated = await res.json();
                console.log("OK")
                setConfig(updated);
                console.log("OK")

                if (audioFile) {
                    const formData = new FormData();
                    console.log("OK")
                    formData.append("file", audioFile);
                    console.log("OK")

                    const audioRes = await fetch("http://localhost:8080/api/v1/first-word/audio", {
                        method: "POST",
                        body: formData,
                        credentials: "include"
                    });
                    console.log("OK")

                    if (audioRes.ok) {
                        setAudioFile(null);
                        console.log("OK")
                    }
                    console.log("OK")
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

            await fetch("http://localhost:8080/webhook/v1/twitch/event-sub/chat-message-events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(mockEvent)
            });

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
            const res = await fetch("http://localhost:8080/api/v1/first-word", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    enabled: checked
                }),
                credentials: "include"
            });

            if (res.ok) {
                const updated = await res.json();
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
                            <Input
                                id="audio_file"
                                type="file"
                                accept="audio/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setAudioFile(e.target.files[0]);
                                    }
                                }}
                            />
                            <p className="text-sm text-muted-foreground">
                                อัปโหลดไฟล์เสียงที่จะเล่นเมื่อมีผู้ใช้งานใหม่ทักทายเข้ามา
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t px-6 py-4">
                    <Button variant="outline" onClick={handleTestAudio} disabled={isTesting}>
                        {isTesting ? (
                            <>Testing...</>
                        ) : (
                            <>
                                <Play className="mr-2 h-4 w-4" />
                                Test Audio
                            </>
                        )}
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                    </Button>
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
        </div >
    );
}
