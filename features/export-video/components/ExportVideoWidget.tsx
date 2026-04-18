"use client"

import { useExportVideo } from "../hooks/useExportVideo";
import { ExportVideoHistoryList } from "./ExportVideoHistoryList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { YouTubePrivacySelect } from "./YouTubePrivacySelect";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Clock,
    Video,
    Settings,
    Zap,
    Shield,
    Tags,
    FileText,
    Plus,
    X,
    LayoutDashboard,
    ExternalLink,
    Play,
    Info
} from "lucide-react";
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
import { YouTube } from "@/components/icons/youtube";
import { ReplyMessageTextarea } from "@/components/widget/ReplyMessageTextarea";
import { useUser } from "@/components/user-context";
import TrailblazerAccordian from "@/components/TrailblazerAccordian/TrailblazerAccordian";
import TrailblazerAccordianTrigger from "@/components/TrailblazerAccordian/TrailblazerAccordianTrigger";
import TrailblazerAccordianContent from "@/components/TrailblazerAccordian/TrailblazerAccordianContent";

export function ExportVideoWidget({ initialConfig, initialRequiresProPlan = false }: { initialConfig: any | null; initialRequiresProPlan?: boolean }) {
    const controller = useExportVideo(initialConfig, initialRequiresProPlan);
    const { user } = useUser()

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
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                        <YouTube className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold">Auto Export Video to YouTube</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    ส่งออกวิดีโอ (VOD) จาก Twitch ไปยัง YouTube โดยอัตโนมัติเมื่อคุณสตรีมจบ
                </p>
            </div>

            <Tabs value={controller.activeTab} onValueChange={controller.setActiveTab} className="w-full max-w-2xl">
                <TabsList className={cn("grid w-full mb-4", controller.config ? "grid-cols-4" : "grid-cols-1")}>
                    <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
                    {controller.config && (
                        <>
                            <TabsTrigger value="quick-start" className="cursor-pointer">Quick Start</TabsTrigger>
                            <TabsTrigger value="settings" className="cursor-pointer">Settings</TabsTrigger>
                            <TabsTrigger value="history" className="cursor-pointer">Export History</TabsTrigger>
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
                            อยากเก็บวิดีโอสตรีมย้อนหลังทุกอันของคุณไว้ดูนานๆ หรือเอาไปลง YouTube แต่ขี้เกียจโหลดแล้วอัปโหลดใหม่เองทุกครั้งใช่ไหม? วิดเจ็ตนี้จะทำการส่งออก วิดีโอสตรีมล่าสุดของคุณไปยัง YouTube โดยอัตโนมัติทันทีที่คุณจบการสตรีม
                        </p>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                <div className="p-2 w-fit rounded-lg bg-red-500/10 text-red-500 mb-3">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold mb-1">Auto Export</h3>
                                <p className="text-sm text-muted-foreground">ทำงานอัตโนมัติเมื่อคุณลงสตรีม</p>
                            </div>
                            <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                <div className="p-2 w-fit rounded-lg bg-blue-500/10 text-blue-500 mb-3">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold mb-1">Privacy Control</h3>
                                <p className="text-sm text-muted-foreground">เลือกสถานะวิดีโอ (Private/Unlisted/Public) ได้ตามต้องการ</p>
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
                                        description: <WidgetEnabledBadge />
                                    },
                                    {
                                        step: 2,
                                        title: "เปิดใช้งาน เก็บการถ่ายทอดสดในอดีต บน Twitch",
                                        description: (
                                            <div className="space-y-2">
                                                <p className="text-sm text-white/70">ปรับให้ช่องบน Twitch ของคุณ เก็บวิดีโอย้อนหลังตอนสตรีมได้</p>
                                                <Button size="sm" variant="twitch" className="gap-2" asChild>
                                                    <a href={`https://dashboard.twitch.tv/u/${user?.username}/settings/stream`} target="_blank">
                                                        ไปที่หน้าตั้งค่าการสตรีม
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </Button>

                                                <TrailblazerAccordian defaultOpen>
                                                    <TrailblazerAccordianTrigger>
                                                        <div className="flex items-center gap-2">
                                                            <Info className="w-4 h-4" />
                                                            วิธีการเปิด เก็บการถ่ายทอดสดในอดีต
                                                        </div>
                                                    </TrailblazerAccordianTrigger>
                                                    <TrailblazerAccordianContent>
                                                        <ol className="list-decimal pl-5 space-y-1">
                                                            <li>กดปุ่ม "ไปที่หน้าตั้งค่าการสตรีม" ข้างบน</li>
                                                            <li>เลื่อนหาหัวข้อ "การตั้งค่าวิดีโอย้อนหลังและการย้อนสตรีม"</li>
                                                            <li>กดเปิด "เก็บการถ่ายทอดสดในอดีต"</li>
                                                        </ol>
                                                    </TrailblazerAccordianContent>
                                                </TrailblazerAccordian>

                                            </div>
                                        )
                                    },
                                    {
                                        step: 3,
                                        title: "เชื่อมต่อบัญชี YouTube",
                                        description: (
                                            <div className="space-y-2">
                                                <p className="text-sm text-white/70">ตรวจสอบให้แน่ใจว่าคุณได้เชื่อมต่อบัญชี YouTube บน Twitch แล้ว สามารถเช็คได้โดยกดปุ่มด้านล่างแล้วเลื่อนหาช่องที่เป็น YouTube ได้เลย</p>
                                                <Button size="sm" variant="twitch" className="gap-2" asChild>
                                                    <a href="https://www.twitch.tv/settings/connections" target="_blank">
                                                        ไปที่หน้าเชื่อมต่อบัญชี Twitch
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </Button>
                                            </div>
                                        )
                                    },
                                    {
                                        step: 4,
                                        title: "ตั้งค่าความเป็นส่วนตัว",
                                        description: (
                                            <div className="space-y-4">
                                                <p className="text-sm text-white/70">กำหนดสถานะความเป็นส่วนตัวของวิดีโอที่จะถูกส่งออกไปยัง YouTube หากยังไม่แน่ใจ แนะนำให้เลือกเป็นแบบ Unlisted จะทำให้วิดีโอไม่โผล่ในช่อง YouTube ให้คนอื่นเห็น แต่ยังสามารถเข้าดูผ่านลิงก์ได้</p>
                                                <div className="space-y-2">
                                                    <YouTubePrivacySelect
                                                        value={controller.privacyStatus}
                                                        onValueChange={controller.setPrivacyStatus}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    },
                                    {
                                        step: 5,
                                        title: "บันทึกการตั้งค่า",
                                        description: (
                                            <div className="space-y-3">
                                                <p className="text-sm text-white/70">กดบันทึกเพื่อให้ระบบเริ่มทำงานโดยอัตโนมัติในการสตรีมครั้งถัดไป</p>
                                                <SaveWidgetButton onSave={controller.handleSave} isLoading={controller.isSaving} />
                                            </div>
                                        )
                                    },
                                    {
                                        step: 6,
                                        title: "ทดลองใช้งาน",
                                        description: (
                                            <div className="space-y-3">
                                                <p className="text-sm text-white/70">คุณสามารถกดปุ่มด้านล่างเพื่อส่งออกวิดีโอล่าสุดของคุณไปยัง YouTube ได้ทันที</p>
                                                <Button
                                                    variant="outline"
                                                    onClick={controller.handleTestExport}
                                                    disabled={controller.isTesting}
                                                    className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
                                                >
                                                    {controller.isTesting ? "กำลังทดสอบ..." : (
                                                        <>
                                                            <Play className="mr-2 h-4 w-4" />
                                                            Test Export Video
                                                        </>
                                                    )}
                                                </Button>
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
                        onStatusChange={controller.handleStatusChange}
                    >
                        <WidgetSettingsCardContent>
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                                        <YouTube className="w-5 h-5 text-red-500" />
                                        <h3 className="text-lg font-semibold">YouTube Settings</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ความเป็นส่วนตัว</Label>
                                        <p className="text-sm text-muted-foreground">กำหนดสถานะเริ่มต้นของวิดีโอที่ถูกส่งออกไปยัง YouTube</p>
                                        <YouTubePrivacySelect
                                            value={controller.privacyStatus}
                                            onValueChange={controller.setPrivacyStatus}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                                        <Tags className="w-5 h-5 text-yellow-500" />
                                        <h3 className="text-lg font-semibold">Tags & Metadata</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>คำอธิบายวิดีโอ</Label>
                                        <p className="text-sm text-muted-foreground">คำอธิบายที่คงที่สำหรับทุกวิดีโอที่คุณส่งออก</p>
                                        <div className="relative">
                                            <Textarea
                                                maxLength={5000}
                                                placeholder="ใส่คำอธิบายที่จะใช้สำหรับวิดีโอที่ส่งออก..."
                                                rows={5}
                                                value={controller.description}
                                                onChange={(e) => controller.setDescription(e.target.value)}
                                            />
                                            <div className="flex justify-between items-center absolute bottom-0 right-0 mr-4 mb-2">
                                                <span className={cn("text-xs", controller.description.length > 5000 ? "text-red-500" : "text-muted-foreground")}>
                                                    {controller.description.length}/5000
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>แท็ก</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="เพิ่มแท็ก..."
                                                value={controller.tagsInput}
                                                onChange={(e) => controller.setTagsInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && controller.handleAddTag()}
                                            />
                                            <Button type="button" variant="secondary" onClick={controller.handleAddTag}>
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {controller.tags.map(tag => (
                                                <Badge key={tag} variant="secondary" className="gap-1">
                                                    <span className="text-sm">{tag}</span>
                                                    <span><X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => controller.handleRemoveTag(tag)} /></span>
                                                </Badge>
                                            ))}
                                            {controller.tags.length === 0 && (
                                                <span className="text-sm text-muted-foreground italic">ยังไม่มีแท็ก</span>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </WidgetSettingsCardContent>
                        <WidgetSettingsCardFooter>
                            <DeleteWidgetButton onDelete={controller.handleDelete} isLoading={controller.isSaving} />
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={controller.handleTestExport}
                                    disabled={controller.isTesting}
                                >
                                    {controller.isTesting ? (
                                        <>กำลังทดสอบ...</>
                                    ) : (
                                        <>
                                            <Play className="mr-2 h-4 w-4" />
                                            Test Export Video
                                        </>
                                    )}
                                </Button>
                                <SaveWidgetButton onSave={controller.handleSave} isLoading={controller.isSaving} />
                            </div>
                        </WidgetSettingsCardFooter>
                    </WidgetSettingsCard>
                </TabsContent>

                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-red-500" />
                                Export History
                            </CardTitle>
                            <CardDescription>
                                รายการวิดีโอที่ถูกส่งออกไปยัง YouTube ล่าสุดของคุณ
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6">
                            <ExportVideoHistoryList
                                history={controller.history}
                                isLoading={controller.isLoadingHistory}
                                pagination={{
                                    page: controller.historyPage,
                                    limit: controller.historyLimit,
                                    total: controller.historyTotal
                                }}
                                onFetch={controller.fetchHistory}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
