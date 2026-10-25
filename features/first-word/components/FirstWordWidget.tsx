"use client"

import { useFirstWord } from "../hooks/useFirstWord";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Music } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import WidgetOverviewCard from "@/components/widget/widget-tab-card/WidgetOverviewCard";
import WidgetQuickStartCard from "@/components/widget/widget-tab-card/WidgetQuickStartCard";
import { WidgetStepper } from "@/components/widget/WidgetStepper/WidgetStepper";
import WidgetStepperItems from "@/components/widget/WidgetStepper/WidgetStepperItems/WidgetStepperItems";
import WidgetEnabledBadge from "@/components/widget/WidgetEnabledBadge";
import { SaveWidgetButton } from "@/components/button/SaveWidgetButton";
import { DeleteWidgetButton } from "@/components/button/DeleteWidgetButton";
import { TestWidgetButton } from "@/components/button/TestWidgetButton";
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
import GoToSettingsButton from "@/components/widget/GoToSettingsButton";
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
import { WidgetTypeMeta } from "@/services/widget.service";

export function FirstWordWidget({ initialConfig, initialRequiresProPlan = false, widgetType }: { initialConfig: FirstWordConfig | null; initialRequiresProPlan?: boolean; widgetType: WidgetTypeMeta }) {

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
        <WidgetConfigLayout widgetType={widgetType}>
            {({ triggerRefresh, refreshKey }) => (
                <>
                    <Tabs value={controller.activeTab} onValueChange={controller.setActiveTab} className="w-full">
                        <TabsList className={cn("grid w-full mb-4", controller.config ? "grid-cols-4" : "grid-cols-1")}>
                            <TabsTrigger value="overview" className="cursor-pointer">ภาพรวม</TabsTrigger>
                            {controller.config && (
                                <>
                                    <TabsTrigger value="quick-start" className="cursor-pointer">เริ่มต้นใช้งาน</TabsTrigger>
                                    <TabsTrigger value="settings" className="cursor-pointer">ตั้งค่า</TabsTrigger>
                                    <TabsTrigger value="custom-replies" className="cursor-pointer">ข้อความเฉพาะคน</TabsTrigger>
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
                                <p className="text-foreground text-base leading-relaxed">
                                    อยากให้ช่องคึกคัก ต้องเริ่มที่การทักทาย! วิดเจ็ตนี้จะช่วยต้อนรับผู้ชมหน้าใหม่ทันทีที่เขาพิมพ์แชทครั้งแรก ไม่ต้องกลัวหลุดโฟกัสตอนเล่นเกม หรือคุยเพลินจนลืมทัก ช่วยสร้างความประทับใจแรกสุดปัง ให้ทุกคนรู้สึกอบอุ่นเหมือนเพื่อนสนิท แถมยังตั้งค่าข้อความและเสียงเอฟเฟกต์กวนๆ ได้ตามสไตล์คุณ!
                                </p>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="p-4 border rounded-xl bg-card">
                                        <div className="p-2 w-fit rounded-lg bg-info/10 text-info mb-3">
                                            <MessageSquare className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-semibold mb-1">Auto Greeting</h3>
                                        <p className="text-sm text-muted-foreground">ต้อนรับผู้ชมใหม่โดยอัตโนมัติเมื่อพวกเขาพิมพ์ข้อความแรก</p>
                                    </div>
                                    <div className="p-4 border rounded-xl bg-card">
                                        <div className="p-2 w-fit rounded-lg bg-violet/10 text-violet mb-3">
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
                                                title: "เปิดใช้งานวิดเจ็ต",
                                                description: (
                                                    <div className="space-y-3">
                                                        <p className="text-sm text-muted-foreground">เปิดวิดเจ็ตนี้เพื่อให้ระบบทักทายคนดูที่เข้ามาใหม่ในช่องของคุณโดยอัตโนมัติ</p>
                                                        <WidgetEnabledBadge />
                                                    </div>
                                                )
                                            },
                                            {
                                                step: 2,
                                                title: "ใส่ข้อความ",
                                                description: (
                                                    <div className="space-y-3">
                                                        <p className="text-sm text-muted-foreground">ใส่ข้อความเพื่อทักทายคนดูที่เข้ามาใหม่บน Twitch โดยคุณสามารถใช้ตัวแปรที่กำหนดให้ใส่เข้าไปในกล่องข้อความด้วย เพื่อให้เมื่อข้อความแสดงขึ้นมาแล้ว มันจะเปลี่ยนไปตามคนดูที่เข้ามา เช่น ชื่อของคนดูที่เข้ามาใหม่</p>
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
                                                        <p className="text-sm text-muted-foreground">นำลิงก์โอเวอร์เลย์ด้านล่างนี้ไปใส่ใน OBS ของคุณ (Browser Source) เพื่อให้เสียงเอฟเฟกต์ทำงาน</p>
                                                        <SmartOverlayUrlInput url={controller.overlayUrl} slug={"first-word"} hideLabel />
                                                        <OBSSetupHelp />
                                                    </div>
                                                )
                                            },
                                            {
                                                step: 4,
                                                title: "บันทึกและทดสอบ",
                                                description: (
                                                    <div className="space-y-3">
                                                        <p className="text-sm text-muted-foreground">ตรวจสอบข้อมูลให้เรียบร้อยแล้วกดบันทึกเพื่อเริ่มทักทายคนดูได้เลย</p>
                                                        <div className="flex items-center gap-2">
                                                            <SaveWidgetButton onSave={controller.handleSave} isLoading={controller.isSaving} />
                                                            <TestWidgetButton onTest={controller.handleTestAudio} isLoading={controller.isTesting} />
                                                        </div>
                                                    </div>
                                                )
                                            },
                                            {
                                                step: 5,
                                                title: "การตั้งค่าเพิ่มเติม",
                                                description: (
                                                    <div className="space-y-3">
                                                        <p className="text-sm text-muted-foreground">ปรับเสียงเอฟเฟกต์ เลือกบัญชีที่ใช้ส่งข้อความ หรือรีเซ็ตรายชื่อคนดูเพื่อเริ่มทักทายใหม่ได้ในแท็บตั้งค่า (ข้อความเฉพาะคนอยู่ในแท็บข้อความเฉพาะคน)</p>
                                                        <GoToSettingsButton onClick={() => controller.setActiveTab("settings")} />
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
                                                hideLabel
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
                                            <p className="text-sm text-muted-foreground">อัปโหลดไฟล์เสียงที่จะเล่นเมื่อมีผู้ชมใหม่เข้ามาพิมพ์ข้อความแรก (รองรับไฟล์ MP3, WAV, OGG)</p>
                                            <AudioFileUploader
                                                hideLabel
                                                currentFileName={controller.audioFile?.name || null}
                                                selectedFile={controller.audioFile}
                                                onFileSelect={(file) => controller.setAudioFile(file)}
                                                audioVolume={controller.audioVolume}
                                                onAudioVolumeChange={controller.setAudioVolume}
                                                disabled={controller.isSaving}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <SmartOverlayUrlInput url={controller.overlayUrl} slug={"first-word"} />
                                        </div>

                                        <div className="pt-4 border-t border-border space-y-4">
                                            <div className="flex flex-col gap-1">
                                                <h3 className="text-sm font-medium text-foreground">รีเซ็ตรายชื่อคนดู</h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    ระบบจะจำว่าใครที่ทักทายไปแล้วบ้างเพื่อป้องกันการส่งซ้ำ หากคุณต้องการเริ่มนับใหม่ (เช่น เริ่มสตรีมใหม่) คุณสามารถกดรีเซ็ตที่นี่ได้
                                                </p>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="w-fit"
                                                onClick={controller.handleResetClick}
                                                disabled={controller.isResettingChatters}
                                            >
                                                <RefreshCcw className={cn("mr-2 h-4 w-4", controller.isResettingChatters && "animate-spin")} />
                                                รีเซ็ตรายชื่อคนดู
                                            </Button>
                                        </div>
                                    </div>
                                </WidgetSettingsCardContent>
                                <WidgetSettingsCardFooter>
                                    <DeleteWidgetButton onDelete={controller.handleDelete} isLoading={controller.isSaving} />
                                    <div className="flex gap-2">
                                        <TestWidgetButton onTest={controller.handleTestAudio} isLoading={controller.isTesting} />
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
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>ยืนยันการรีเซ็ต?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    คุณมีรายชื่อคนดูที่ทักทายไปแล้วทั้งหมด {controller.chattersCount} คน การรีเซ็ตจะทำให้ทุกคนที่พิมพ์แชทเข้ามาใหม่ถูกทักทายอีกครั้งเหมือนเป็นคนดูใหม่
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={controller.handleConfirmReset}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
