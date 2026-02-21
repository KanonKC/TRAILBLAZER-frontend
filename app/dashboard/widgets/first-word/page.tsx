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
import { Skeleton } from "@/components/ui/skeleton";
import { AudioFileUploader } from "@/components/widget/AudioFileUploader/AudioFileUploader";
import { BotProfileSelector } from "@/components/widget/BotProfileSelector";
import { CustomReplyList } from "@/components/widget/CustomReplyList";
import { OBSSetupHelp } from "@/components/widget/OBSSetupHelp";
import { OverlayUrlInput } from "@/components/widget/OverlayUrlInput";
import { ReplyMessageTextarea } from "@/components/widget/ReplyMessageTextarea";
import { WidgetStatusControl } from "@/components/widget/WidgetStatusControl";
import { WidgetTestControl } from "@/components/widget/WidgetTestControl";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/components/user-context";
import { cn } from "@/lib/utils";
import { AudioWaveform, ExternalLink, MessageSquare, Music, Play, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";

import MultiStepProgressBar from "@/components/MultiStepProgressBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WidgetOverviewCard from "@/components/widget/widget-tab-card/WidgetOverviewCard";
import WidgetQuickStartCard from "@/components/widget/widget-tab-card/WidgetQuickStartCard";
import WidgetSettingsCard from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCard";
import WidgetSettingsCardContent from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardContent";
import WidgetSettingsCardFooter from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardFooter";
import {
    enableFirstWord,
    getFirstWordConfig,
    refreshFirstWordOverlayKey,
    testFirstWordAudio,
    updateFirstWordConfig,
    type FirstWordConfig
} from "@/services/firstWord.service";
import { UploadedFile, uploadFile } from "@/services/uploadedFile.service";
import { deleteWidget } from "@/services/widget.service";
import { toast } from "sonner";


import { DeleteWidgetButton } from "@/components/button/DeleteWidgetButton";
import { SaveWidgetButton } from "@/components/button/SaveWidgetButton";
import { FirstWordVariableMap } from "@/constants/firstWord";

export default function FirstWordWidgetPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const [config, setConfig] = useState<FirstWordConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [replyMessage, setReplyMessage] = useState("");
    const [replyMessageError, setReplyMessageError] = useState<string | null>(null);
    const [isEnabled, setIsEnabled] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [audioFile, setAudioFile] = useState<File | UploadedFile | null>(null);
    const [botProfile, setBotProfile] = useState<string>(user?.twitchId || "");

    const [showConfirmRefresh, setShowConfirmRefresh] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");


    // ... (rest of state)

    const handleOnFileSelect = (file: File | UploadedFile | null, fileKey: string | null) => {
        if (!fileKey) return;
        updateFirstWordConfig({
            audio_key: fileKey
        }).then(fetchConfig);
    };

    const handleDelete = async () => {
        if (!config?.widget?.id) return;
        setIsSaving(true);
        try {
            const success = await deleteWidget(config.widget.id);
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
        ? `${window.location.origin}/overlays/first-word/${user.id}${config?.widget && config.widget.overlay_key ? `?key=${config.widget.overlay_key}` : ''}`

        : "";


    const fetchConfig = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        if (isUserLoading) return;
        if (!user) {
            setIsLoading(false);
            return;
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
            const payload: Partial<FirstWordConfig> = {
                reply_message: replyMessage,
                twitch_bot_id: botProfile === "default" ? null : botProfile
            };

            if (audioFile) {
                if (audioFile instanceof File) {
                    const uploaded = await uploadFile(audioFile);
                    payload.audio_key = uploaded.id;
                } else {
                    payload.audio_key = audioFile.id;
                }
            }

            const updated = await updateFirstWordConfig(payload);

            if (updated) {
                setConfig(updated);
                setAudioFile(null);

                // Optionally show toast
                toast.success("บันทึกสำเร็จ", {
                    description: "การตั้งค่าของคุณถูกบันทึกเรียบร้อยแล้ว",
                });
            }
        } catch (error) {
            console.error("Failed to update", error);
            toast.error("บันทึกไม่สำเร็จ", {
                description: "เกิดข้อผิดพลาดในการบันทึกการตั้งค่า",
            });
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
                <TabsList className={cn("grid w-full mb-4", config ? "grid-cols-4" : "grid-cols-1")}>
                    <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
                    {config && (
                        <>
                            <TabsTrigger value="quick-start" className="cursor-pointer">Quick Start</TabsTrigger>
                            <TabsTrigger value="settings" className="cursor-pointer">Settings</TabsTrigger>
                            <TabsTrigger value="custom-replies" className="cursor-pointer">Custom Replies</TabsTrigger>
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
                                title: "ใส่ข้อความ",
                                description: (
                                    <div className="space-y-3">
                                        <p className="text-sm text-white/70">ใส่ข้อความเพื่อทักทายคนดูที่เข้ามาใหม่บน Twitch โดยคุณสามารถใช้ตัวแปรที่กำหนดให้ใส่เข้าไปในกล่องข้อความด้วย เพื่อให้เมื่อข้อความแสดงขึ้นมาแล้ว มันจะเปลี่ยนไปตามคนดูที่เข้ามา เช่น ชื่อของคนดูที่เข้ามาใหม่</p>
                                        <ReplyMessageTextarea
                                            hideLabel
                                            value={replyMessage}
                                            onChange={handleReplyMessageChange}
                                            error={replyMessageError}
                                            variables={FirstWordVariableMap}
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
                                            currentFileName={config?.audio.name}
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
                                    <>
                                        <p className="text-sm text-white/70">กดบันทึกและทดสอบว่าการทำงานทั้งหมดถูกต้อง ลองกดที่ปุ่ม Test ด้านล่าง</p>

                                        <ol className="text-sm text-white/70 list-decimal pl-5 space-y-1 mt-2">
                                            <li>ต้องมีข้อความแสดงขึ้นมาบนช่องแชท Twitch ของคุณ</li>
                                            <li>ต้องมีเสียงเล่นออกมาจากโปรแกรม OBS</li>
                                        </ol>
                                        <WidgetTestControl
                                            isSaving={isSaving}
                                            isTesting={isTesting}
                                            onSave={handleSave}
                                            onTest={handleTestAudio}
                                            canTest={!!(config?.audio_key || config?.reply_message)}
                                        />
                                    </>
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
                            <MultiStepProgressBar
                                key={item.step}
                                data={item}
                                drawConnector={index !== array.length - 1}
                            />
                        ))}
                    </WidgetQuickStartCard>
                </TabsContent>

                <TabsContent value="settings">
                    <WidgetSettingsCard>
                        <WidgetSettingsCardContent>
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
                                        }
                                    ]}
                                />
                            </div>

                            {/* Audio Section */}
                            <div className="space-y-4 ">
                                <div className="flex items-center gap-2 border-b pb-2">
                                    <AudioWaveform className="w-5 h-5 text-purple-500" />
                                    <h3 className="text-lg font-semibold">เสียงและโอเวอร์เลย์</h3>
                                </div>
                                <div className="">
                                    <AudioFileUploader
                                        currentFileName={config?.audio.name}
                                        selectedFile={audioFile}
                                        onFileSelect={handleOnFileSelect}
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
                        </WidgetSettingsCardContent>
                        <WidgetSettingsCardFooter>
                            <DeleteWidgetButton
                                onDelete={handleDelete}
                                isLoading={isSaving}
                            />
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
                                <SaveWidgetButton onSave={handleSave} isLoading={isSaving} />
                            </div>
                        </WidgetSettingsCardFooter>
                    </WidgetSettingsCard>
                </TabsContent>

                <TabsContent value="custom-replies">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 justify-between">
                                <span className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-500" />
                                    ข้อความตอบกลับเฉพาะบุคคล
                                </span>
                            </CardTitle>
                            <CardDescription>
                                ตั้งค่าข้อความตอบกลับหรือเสียงเอฟเฟกต์เฉพาะรายบุคคล เมื่อพวกเขาเข้ามาทักทายในช่อง
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6">
                            <CustomReplyList />
                        </CardContent>
                    </Card>
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
        </div >
    );
}
