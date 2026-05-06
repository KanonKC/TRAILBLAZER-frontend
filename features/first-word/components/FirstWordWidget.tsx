"use client"

import { useFirstWord } from "../hooks/useFirstWord";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Music, Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import WidgetOverviewCard from "@/components/widget/widget-tab-card/WidgetOverviewCard";
import WidgetQuickStartCard from "@/components/widget/widget-tab-card/WidgetQuickStartCard";
import { WidgetStepper } from "@/components/widget/WidgetStepper/WidgetStepper";
import WidgetStepperItems from "@/components/widget/WidgetStepper/WidgetStepperItems/WidgetStepperItems";
import WidgetEnabledBadge from "@/components/widget/WidgetEnabledBadge";
import { SaveWidgetButton } from "@/components/button/SaveWidgetButton";
import { DeleteWidgetButton } from "@/components/button/DeleteWidgetButton";
import WidgetSettingsCard from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCard";
import WidgetSettingsCardContent from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardContent";
import WidgetSettingsCardFooter from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardFooter";
import { ReplyMessageTextarea } from "@/components/widget/ReplyMessageTextarea";
import { BotProfileSelector } from "@/components/widget/BotProfileSelector";
import { SmartOverlayUrlInput } from "@/components/widget/SmartOverlayUrlInput";
import { OBSSetupHelp } from "@/components/widget/OBSSetupHelp";
import { AudioFileUploader } from "@/components/widget/AudioFileUploader/AudioFileUploader";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Trash2 } from "lucide-react";
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
import { CustomReplyList } from "./CustomReplyList";
import { FirstWordConfig } from "../types";
import { FirstWordVariableMap } from "@/constants/firstWord";
import { WidgetConfigLayout } from "@/components/widget/layout/WidgetConfigLayout";

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
        <WidgetConfigLayout
            title="Greeting Message"
            description="ต้อนรับผู้ชมใหม่โดยอัตโนมัติด้วยข้อความทักทายและเสียงเอฟเฟกต์ที่คุณกำหนดเอง"
            icon={<MessageSquare className="w-6 h-6" />}
            iconClassName="bg-blue-500/10 text-blue-500"
        >
            {({ triggerRefresh, refreshKey }) => (
                <>
                    <Tabs value={controller.activeTab} onValueChange={controller.setActiveTab} className="w-full">
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
                                onClickEnable={async () => {
                                    await controller.handleEnable();
                                    triggerRefresh();
                                }}
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
                                <WidgetStepper>
                                    <WidgetStepperItems
                                        items={[
                                            {
                                                step: 1,
                                                title: "เปิดใช้งาน Widget",
                                                description: (
                                                    <WidgetEnabledBadge />
                                                )
                                            },
                                            {
                                                step: 2,
                                                title: "ใส่ข้อความ",
                                                description: (
                                                    <div className="space-y-3">
                                                        <p className="text-sm text-white/70">ใส่ข้อความเพื่อทักทายคนดูที่เข้ามาใหม่บน Twitch โดยคุณสามารถใช้ตัวแปรที่กำหนดให้ใส่เข้าไปในกล่องข้อความด้วย เพื่อให้เมื่อข้อความแสดงขึ้นมาแล้ว มันจะเปลี่ยนไปตามคนดูที่เข้ามา เช่น ชื่อของคนดูที่เข้ามาใหม่</p>
                                                        <ReplyMessageTextarea
                                                            defaultOpenHelp
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
                                                title: "เชื่อมต่อกับ OBS",
                                                description: (
                                                    <div className="space-y-3">
                                                        <p className="text-sm text-white/70">นำ Overlay URL ด้านล่างนี้ไปใส่ใน OBS ของคุณ (Browser Source) เพื่อให้เสียงเอฟเฟกต์ทำงาน</p>
                                                        <SmartOverlayUrlInput url={controller.overlayUrl} slug={"first-word"}/>
                                                        <OBSSetupHelp />
                                                    </div>
                                                )
                                            },
                                            {
                                                step: 4,
                                                title: "บันทึกและพร้อมลุย!",
                                                description: (
                                                    <div className="space-y-3">
                                                        <p className="text-sm text-white/70">ตรวจสอบข้อมูลให้เรียบร้อยแล้วกดบันทึกเพื่อเริ่มทักทายคนดูได้เลย</p>
                                                        <SaveWidgetButton onSave={controller.handleSave} isLoading={controller.isSaving} />
                                                    </div>
                                                )
                                            }
                                        ]}
                                    />
                                </WidgetStepper>
                            </WidgetQuickStartCard>
                        </TabsContent>

                        <TabsContent value="settings">
                            <WidgetSettingsCard
                                widgetId={controller.config?.widget?.id}
                                isEnabled={controller.isEnabled}
                                cost={controller.config?.widget?.widget_type?.cost}
                                onStatusChange={controller.handleStatusChange}
                                onSuccess={triggerRefresh}
                            >
                                <WidgetSettingsCardContent>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label>ส่งข้อความผ่านบัญชี</Label>
                                            <p className="text-sm text-muted-foreground">เลือกบัญชีที่จะใช้ส่งข้อความตอบกลับในแชท</p>
                                            <BotProfileSelector
                                                value={controller.botProfile}
                                                onValueChange={controller.setBotProfile}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>ข้อความตอบกลับ</Label>
                                            <ReplyMessageTextarea
                                                value={controller.replyMessage}
                                                onChange={controller.handleReplyMessageChange}
                                                error={controller.replyMessageError}
                                                variables={FirstWordVariableMap}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>เสียงเอฟเฟกต์</Label>
                                            <AudioFileUploader
                                                currentFileName={controller.audioFile?.name || null}
                                                selectedFile={controller.audioFile}
                                                onFileSelect={(file) => controller.setAudioFile(file)}
                                                audioVolume={controller.audioVolume}
                                                onAudioVolumeChange={controller.setAudioVolume}
                                                disabled={controller.isSaving}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>URL ของวิดเจ็ต (สำหรับ OBS)</Label>
                                            <SmartOverlayUrlInput url={controller.overlayUrl} slug={"first-word"}/>
                                        </div>

                                        <div className="pt-4 border-t border-white/10 space-y-4">
                                            <div className="flex flex-col gap-1">
                                                <h3 className="text-sm font-medium text-white/90">รีเซ็ตรายชื่อคนดู</h3>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    ระบบจะจำว่าใครที่ทักทายไปแล้วบ้างเพื่อป้องกันการส่งซ้ำ หากคุณต้องการเริ่มนับใหม่ (เช่น เริ่มสตรีมใหม่) คุณสามารถกดรีเซ็ตที่นี่ได้
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-fit"
                                                onClick={controller.handleResetClick}
                                                disabled={controller.isResettingChatters}
                                            >
                                                <RefreshCcw className={cn("mr-2 h-4 w-4", controller.isResettingChatters && "animate-spin")} />
                                                รีเซ็ตรายชื่อผู้มาเยือน
                                            </Button>
                                        </div>
                                    </div>
                                </WidgetSettingsCardContent>
                                <WidgetSettingsCardFooter>
                                    <DeleteWidgetButton onDelete={controller.handleDelete} isLoading={controller.isSaving} />
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={controller.handleTestAudio}
                                            disabled={controller.isTesting}
                                        >
                                            {controller.isTesting ? "Testing..." : <><Play className="mr-2 h-4 w-4" /> Test Sound</>}
                                        </Button>
                                        <SaveWidgetButton onSave={controller.handleSave} isLoading={controller.isSaving} />
                                    </div>
                                </WidgetSettingsCardFooter>
                            </WidgetSettingsCard>
                        </TabsContent>

                        <TabsContent value="custom-replies">
                            <CustomReplyList />
                        </TabsContent>
                    </Tabs>

                    {/* Reset Confirmation Dialog */}
                    <AlertDialog open={controller.showConfirmReset} onOpenChange={controller.setShowConfirmReset}>
                        <AlertDialogContent className="bg-[#1A1A1A] border-white/10 text-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle>ยืนยันการรีเซ็ต?</AlertDialogTitle>
                                <AlertDialogDescription className="text-white/70">
                                    คุณมีรายชื่อคนดูที่ทักทายไปแล้วทั้งหมด {controller.chattersCount} คน การรีเซ็ตจะทำให้ทุกคนที่พิมพ์แชทเข้ามาใหม่ถูกทักทายอีกครั้งเหมือนเป็นคนดูใหม่
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-transparent border-white/10 hover:bg-white/5 text-white">ยกเลิก</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={controller.handleConfirmReset}
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    ยืนยันการรีเซ็ต
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )}
        </WidgetConfigLayout>
    );
}
