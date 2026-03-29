"use client"

import { CustomReplyList } from "@/app/dashboard/widgets/first-word/_components/CustomReplyList";
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
import { SmartAudioFileUploader } from "@/components/widget/SmartAudioFileUploader";
import { BotProfileSelector } from "@/components/widget/BotProfileSelector";
import { OBSSetupHelp } from "@/components/widget/OBSSetupHelp";
import { SmartOverlayUrlInput } from "@/components/widget/SmartOverlayUrlInput";
import { ReplyMessageTextarea } from "@/components/widget/ReplyMessageTextarea";
import { WidgetStatusControl } from "@/components/widget/WidgetStatusControl";
import { WidgetTestControl } from "@/components/widget/WidgetTestControl";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AudioWaveform, ExternalLink, MessageSquare, Music, Play, RefreshCw, Users } from "lucide-react";
import MultiStepProgressBar from "@/components/MultiStepProgressBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WidgetOverviewCard from "@/components/widget/widget-tab-card/WidgetOverviewCard";
import WidgetQuickStartCard from "@/components/widget/widget-tab-card/WidgetQuickStartCard";
import WidgetSettingsCard from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCard";
import WidgetSettingsCardContent from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardContent";
import WidgetSettingsCardFooter from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardFooter";
import { DeleteWidgetButton } from "@/components/button/DeleteWidgetButton";
import { SaveWidgetButton } from "@/components/button/SaveWidgetButton";
import { FirstWordVariableMap } from "@/constants/firstWord";
import { FirstWordConfig } from "../types";
import { useFirstWord } from "../hooks/useFirstWord";
import WidgetEnabledBadge from "@/components/widget/WidgetEnabledBadge";

export function FirstWordWidget({ initialConfig, initialRequiresProPlan = false }: { initialConfig: FirstWordConfig | null; initialRequiresProPlan?: boolean }) {
    
    // Connect to the Controller
    const controller = useFirstWord(initialConfig, initialRequiresProPlan);

    if (controller.isUserLoading || controller.isLoading) {
        return (
            <div className="container mx-auto py-10">
                <Skeleton className="h-[300px] w-full max-w-2xl mx-auto rounded-xl" />
            </div>
        );
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

            <Tabs value={controller.activeTab} onValueChange={controller.setActiveTab} className="w-full max-w-2xl">
                <TabsList className={cn("grid w-full mb-4", controller.config ? "grid-cols-4" : "grid-cols-1")}>
                    <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
                    {controller.config && (
                        <>
                            <TabsTrigger value="quick-start" className="cursor-pointer">Quick Start</TabsTrigger>
                            <TabsTrigger value="settings" className="cursor-pointer">Settings</TabsTrigger>
                            <TabsTrigger value="custom-replies" className="cursor-pointer">Custom Replies</TabsTrigger>
                        </>
                    )}
                </TabsList>

                <TabsContent value="overview">
                    <WidgetOverviewCard
                        showLoginButton={!controller.user}
                        showEnableButton={!!controller.user && !controller.config && !controller.requiresProPlan}
                        showUpgradeButton={!!controller.user && controller.requiresProPlan}
                        onClickEnable={controller.handleEnable}
                        isLoading={controller.isSaving}
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
                                    <WidgetEnabledBadge/>
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
                                            value={controller.replyMessage}
                                            onChange={controller.handleReplyMessageChange}
                                            error={controller.replyMessageError}
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
                                        <SmartAudioFileUploader
                                            slug="first-word"
                                            currentFileName={controller.config?.audio?.name}
                                            selectedFile={controller.audioFile}
                                            audioVolume={controller.audioVolume}
                                            onAudioVolumeChange={controller.setAudioVolume}
                                            onSuccess={controller.setConfig}
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
                                        <SmartOverlayUrlInput
                                            url={controller.overlayUrl}
                                            slug="first-word"
                                            onSuccess={controller.setConfig}
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
                                            isSaving={controller.isSaving}
                                            isTesting={controller.isTesting}
                                            onSave={controller.handleSave}
                                            onTest={controller.handleTestAudio}
                                            canTest={!!(controller.config?.audio_key || controller.config?.reply_message)}
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
                                                onClick={() => controller.setActiveTab("settings")}
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
                    <WidgetSettingsCard
                        widgetId={controller.config?.widget?.id}
                        isEnabled={controller.isEnabled}
                        onStatusChange={controller.handleStatusChange}
                    >
                        <WidgetSettingsCardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b pb-2">
                                    <MessageSquare className="w-5 h-5 text-blue-500" />
                                    <h3 className="text-lg font-semibold">ข้อความ</h3>
                                </div>
                                <div className="">
                                    <BotProfileSelector
                                        value={controller.botProfile}
                                        onValueChange={controller.setBotProfile}
                                    />
                                </div>
                                <ReplyMessageTextarea
                                    value={controller.replyMessage}
                                    onChange={controller.handleReplyMessageChange}
                                    variant="default"
                                    error={controller.replyMessageError}
                                    variables={[
                                        {
                                            variable: "{{user_name}}",
                                            description: "ชื่อที่แสดงผลของผู้ทักทาย",
                                            example: "User123"
                                        }
                                    ]}
                                />
                            </div>

                            <div className="space-y-4 ">
                                <div className="flex items-center gap-2 border-b pb-2">
                                    <AudioWaveform className="w-5 h-5 text-purple-500" />
                                    <h3 className="text-lg font-semibold">เสียงและโอเวอร์เลย์</h3>
                                </div>
                                <div className="">
                                    <SmartAudioFileUploader
                                        slug="first-word"
                                        currentFileName={controller.config?.audio?.name}
                                        selectedFile={controller.audioFile}
                                        onSuccess={controller.setConfig}
                                        audioVolume={controller.audioVolume}
                                        onAudioVolumeChange={controller.setAudioVolume}
                                        className="text-white"
                                        inputClassName="bg-transparent border-white/20 text-white file:text-white file:bg-white/10 file:border-0 file:mr-4 file:px-4 file:py-2 file:rounded-md file:text-sm file:font-semibold hover:file:bg-white/20"
                                    />
                                </div>
                                <SmartOverlayUrlInput
                                    url={controller.overlayUrl}
                                    slug="first-word"
                                    onSuccess={controller.setConfig}
                                />
                            </div>
                        </WidgetSettingsCardContent>
                        <WidgetSettingsCardFooter>
                            <div className="flex gap-2">
                                <DeleteWidgetButton
                                    onDelete={controller.handleDelete}
                                    isLoading={controller.isSaving}
                                />
                                <Button variant="destructive" onClick={controller.handleResetClick} disabled={controller.isResettingChatters}>
                                    <RefreshCw className={cn("w-4 h-4 shrink-0", controller.isResettingChatters && "animate-spin")} />
                                    รีเซ็ตคนที่เข้ามาทักทาย
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={controller.handleTestAudio} disabled={controller.isTesting && !controller.config?.audio_key && !controller.config?.reply_message}>
                                    {controller.isTesting ? (
                                        <>Testing...</>
                                    ) : (
                                        <>
                                            <Play className="mr-2 h-4 w-4" />
                                            Test
                                        </>
                                    )}
                                </Button>
                                <SaveWidgetButton onSave={controller.handleSave} isLoading={controller.isSaving} />
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


            <AlertDialog open={controller.showConfirmReset} onOpenChange={controller.setShowConfirmReset}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการรีเซ็ตรายชื่อคนทักทาย?</AlertDialogTitle>
                        <AlertDialogDescription>
                            คุณกำลังจะรีเซ็ตรายชื่อคนที่เคยพิมพ์ทักทายในช่องของคุณทั้งหมด {controller.chattersCount} คน การกระทำนี้จะไม่สามารถย้อนกลับได้ คุณแน่ใจหรือไม่?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={controller.isResettingChatters}>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={controller.handleConfirmReset}
                            disabled={controller.isResettingChatters}
                        >
                            {controller.isResettingChatters ? "กำลังรีเซ็ต..." : "ยืนยันการรีเซ็ต"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
