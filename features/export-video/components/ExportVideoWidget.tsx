"use client"

import { useSyncExternalStore } from "react";
import { useExportVideo } from "../hooks/useExportVideo";
import Image from "next/image";
import { ExportVideoHistoryList } from "./ExportVideoHistoryList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import GoToSettingsButton from "@/components/widget/GoToSettingsButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { YouTubePrivacySelect } from "./YouTubePrivacySelect";
import { CharacterCountTextarea } from "@/components/widget/CharacterCountTextarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Clock,
    Zap,
    Shield,
    Tags,
    Plus,
    X,
    ExternalLink,
    Info,
    Puzzle,
    AlertTriangle,
    CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

import ExtensionImage from "@/public/extension.png"

import WidgetOverviewCard from "@/components/widget/widget-tab-card/WidgetOverviewCard";
import WidgetQuickStartCard from "@/components/widget/widget-tab-card/WidgetQuickStartCard";
import { WidgetStepper } from "@/components/widget/WidgetStepper/WidgetStepper";
import WidgetStepperItems from "@/components/widget/WidgetStepper/WidgetStepperItems/WidgetStepperItems";
import WidgetEnabledBadge from "@/components/widget/WidgetEnabledBadge";
import SubLabel from "@/components/SubLabel";
import { TestWidgetButton } from "@/components/button/TestWidgetButton";
import { SaveWidgetButton } from "@/components/button/SaveWidgetButton";
import { DeleteWidgetButton } from "@/components/button/DeleteWidgetButton";
import WidgetSettingsCard from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCard";
import WidgetSettingsCardContent from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardContent";
import WidgetSettingsCardFooter from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardFooter";
import { YouTube } from "@/components/icons/youtube";
import { useUser } from "@/components/user-context";
import TrailblazerAccordian from "@/components/TrailblazerAccordian/TrailblazerAccordian";
import TrailblazerAccordianTrigger from "@/components/TrailblazerAccordian/TrailblazerAccordianTrigger";
import TrailblazerAccordianContent from "@/components/TrailblazerAccordian/TrailblazerAccordianContent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WidgetConfigLayout } from "@/components/widget/layout/WidgetConfigLayout";
import { WidgetTypeMeta } from "@/services/widget.service";

const subscribeToNothing = () => () => {}

function detectChromeBrowser() {
    const userAgent = navigator.userAgent
    return /Chrome\//.test(userAgent) && !/Edg\/|OPR\/|Firefox\/|SamsungBrowser\//.test(userAgent)
}

export function ExportVideoWidget({ initialConfig, initialRequiresProPlan = false, widgetType }: { initialConfig: any | null; initialRequiresProPlan?: boolean; widgetType: WidgetTypeMeta }) {
    const controller = useExportVideo(initialConfig, initialRequiresProPlan);
    const { user } = useUser()
    // server snapshot is null, so the warning never flashes on Chrome or mismatches server HTML
    const isChromeBrowser = useSyncExternalStore(subscribeToNothing, detectChromeBrowser, () => null)

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
                <Tabs value={controller.activeTab} onValueChange={controller.setActiveTab} className="w-full">
                    <TabsList className={cn("grid w-full mb-4", controller.config ? "grid-cols-4" : "grid-cols-1")}>
                        <TabsTrigger value="overview" className="cursor-pointer">ภาพรวม</TabsTrigger>
                        {controller.config && (
                            <>
                                <TabsTrigger value="quick-start" className="cursor-pointer">เริ่มต้นใช้งาน</TabsTrigger>
                                <TabsTrigger value="settings" className="cursor-pointer">ตั้งค่า</TabsTrigger>
                                <TabsTrigger value="history" className="cursor-pointer">ประวัติการนำออก</TabsTrigger>
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
                                อยากเก็บวิดีโอสตรีมย้อนหลังทุกอันของคุณไว้ดูนานๆ หรือเอาไปลง YouTube แต่ขี้เกียจโหลดแล้วอัปโหลดใหม่เองทุกครั้งใช่ไหม? วิดเจ็ตนี้จะทำการส่งออก วิดีโอสตรีมล่าสุดของคุณไปยัง YouTube โดยอัตโนมัติทันทีที่คุณจบการสตรีม
                            </p>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="p-4 border rounded-xl bg-card">
                                    <div className="p-2 w-fit rounded-lg bg-violet/10 text-violet mb-3">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold mb-1">Auto Export</h3>
                                    <p className="text-sm text-muted-foreground">ทำงานอัตโนมัติเมื่อคุณลงสตรีม</p>
                                </div>
                                <div className="p-4 border rounded-xl bg-card">
                                    <div className="p-2 w-fit rounded-lg bg-teal/10 text-teal mb-3">
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
                            {isChromeBrowser === false && (
                                <div className="flex items-start gap-2 p-3 rounded-md bg-warning/10 text-foreground mb-4">
                                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-warning" />
                                    <p className="text-sm">
                                        คำเตือน: โปรดตั้งค่าวิดเจ็ตนี้โดยใช้บราวเซอร์ Google Chrome
                                    </p>
                                </div>
                            )}
                            <WidgetStepper>
                                <WidgetStepperItems
                                    items={[
                                        {
                                            step: 1,
                                            title: "เปิดใช้งานวิดเจ็ต",
                                            description: (<div className="space-y-3">
                                                <p className="text-sm text-muted-foreground">เปิดวิดเจ็ตนี้เพื่อให้ระบบส่งออกวิดีโอสตรีมของคุณไปยัง YouTube โดยอัตโนมัติเมื่อสตรีมจบ</p>
                                                <WidgetEnabledBadge />
                                            </div>)
                                        },
                                        {
                                            step: 2,
                                            title: "เปิดใช้งาน เก็บการถ่ายทอดสดในอดีต บน Twitch",
                                            description: (
                                                <div className="space-y-2">
                                                    <p className="text-sm text-muted-foreground">ปรับให้ช่องบน Twitch ของคุณ เก็บวิดีโอย้อนหลังตอนสตรีมได้</p>
                                                    <Button size="sm" variant="twitch" className="gap-2" asChild>
                                                        <a href={`https://dashboard.twitch.tv/u/${user?.username}/settings/stream`} target="_blank" rel="noopener noreferrer">
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
                                                                <li>กดปุ่ม &quot;ไปที่หน้าตั้งค่าการสตรีม&quot; ข้างบน</li>
                                                                <li>เลื่อนหาหัวข้อ &quot;การตั้งค่าวิดีโอย้อนหลังและการย้อนสตรีม&quot;</li>
                                                                <li>กดเปิด &quot;เก็บการถ่ายทอดสดในอดีต&quot;</li>
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
                                                    <p className="text-sm text-muted-foreground">ตรวจสอบให้แน่ใจว่าคุณได้เชื่อมต่อบัญชี YouTube บน Twitch แล้ว สามารถเช็คได้โดยกดปุ่มด้านล่างแล้วเลื่อนหาช่องที่เป็น YouTube ได้เลย</p>
                                                    <Button size="sm" variant="twitch" className="gap-2" asChild>
                                                        <a href="https://www.twitch.tv/settings/connections" target="_blank" rel="noopener noreferrer">
                                                            ไปที่หน้าเชื่อมต่อบัญชี Twitch
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            )
                                        },
                                        {
                                            step: 4,
                                            title: "ติดตั้ง Extension เพื่อ Sync Twitch Token",
                                            description: (
                                                <div className="space-y-4">
                                                    <p className="text-sm text-muted-foreground">เนื่องจากการนำสตรีมย้อนหลังจาก Twitch ไปยัง YouTube จำเป็นต้องใช้โทเค่นจาก Twitch ของผู้ใช้งาน TRAILBLAZER จึงทำ Extension ออกมาเพื่อให้คุณสามารถเชื่อมกับโทเค่นบน Twitch ได้อย่างง่ายดาย</p>

                                                    <Button asChild>
                                                        <a href="https://chromewebstore.google.com/detail/trailblazer-%E2%80%93-twitch-toke/gpabiodlfkjndeomiilbigjaokomldgl?authuser=0&hl=en" target="_blank" rel="noopener noreferrer">
                                                            <Puzzle className="w-4 h-4" />
                                                            ติดตั้ง Extension
                                                        </a>
                                                    </Button>

                                                    <TrailblazerAccordian defaultOpen>
                                                        <TrailblazerAccordianTrigger>
                                                            <div className="flex items-center gap-2">
                                                                <Info className="w-4 h-4" />
                                                                วิธีการใช้งาน Extension
                                                            </div>
                                                        </TrailblazerAccordianTrigger>
                                                        <TrailblazerAccordianContent>
                                                            <ol className="list-decimal pl-5 space-y-1">
                                                                <li>เปิด Google Chrome และติดตั้ง Extension</li>
                                                                <li>
                                                                    หลังจากติดตั้งแล้ว Extension จะอยู่ทางบนขวาของ Google Chrome กดเปิดเข้าไป จะได้หน้าตาเหมือนในรูป
                                                                    <div className="my-4 flex justify-center"><Image className="rounded-md border p-2" src={ExtensionImage} alt="Extension Image" width={400} height={400} /></div>
                                                                </li>
                                                                <li>เข้าสู่ระบบผ่านแพลตฟอร์มของทั้งสอง เมื่อเชื่อมต่อแล้วปุ่มจะเป็นสีเขียว และขึ้นว่า &quot;เชื่อมต่อแล้ว&quot;</li>
                                                                <li>เมื่อเชื่อมต่อทั้ง 2 แพลตฟอร์มแล้วให้กดปุ่ม &quot;ซิงค์ตอนนี้&quot; หากมีข้อความสีเขียวขึ้นมา จะถือว่าการซิงค์เสร็จสมบูรณ์</li>
                                                            </ol>
                                                        </TrailblazerAccordianContent>
                                                    </TrailblazerAccordian>

                                                </div>
                                            )
                                        },
                                        {
                                            step: 5,
                                            title: "ตั้งค่าความเป็นส่วนตัว",
                                            description: (
                                                <div className="space-y-4">
                                                    <p className="text-sm text-muted-foreground">กำหนดสถานะความเป็นส่วนตัวของวิดีโอที่จะถูกส่งออกไปยัง YouTube (แนะนำ Unlisted)</p>
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
                                            step: 6,
                                            title: "บันทึกการตั้งค่า",
                                            description: (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-muted-foreground">กดบันทึกเพื่อให้ระบบเริ่มทำงานโดยอัตโนมัติในการสตรีมครั้งถัดไป</p>
                                                    <SaveWidgetButton onSave={controller.handleSave} isLoading={controller.isSaving} />
                                                </div>
                                            )
                                        },
                                        {
                                            step: 7,
                                            title: "ทดลองใช้งาน",
                                            description: (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-muted-foreground">คุณสามารถกดปุ่มด้านล่างเพื่อส่งออกวิดีโอล่าสุดของคุณไปยัง YouTube ได้ทันที</p>
                                                    <TestWidgetButton onTest={controller.handleTestExport} isLoading={controller.isTesting} />
                                                </div>
                                            )
                                        },
                                        {
                                            step: 8,
                                            title: "การตั้งค่าเพิ่มเติม",
                                            description: (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-muted-foreground">ตั้งคำอธิบายวิดีโอและแท็กเริ่มต้นสำหรับ YouTube ได้ในแท็บตั้งค่า และดูประวัติการนำออกย้อนหลังได้ในแท็บประวัติการนำออก</p>
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
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <Label>สถานะการเชื่อมต่อกับ Twitch</Label>
                                        {controller.user?.hasTwitchGqlToken ? (
                                            <Alert className="border-success/50 bg-success/10">
                                                <CheckCircle className="h-4 w-4 text-success" />
                                                <AlertTitle className="text-success font-bold">ซิงค์ข้อมูลกับ Twitch สำเร็จ</AlertTitle>
                                                <AlertDescription className="text-foreground">
                                                    ระบบได้รับ Twitch Token ของคุณแล้ว คุณสามารถใช้งานวิดเจ็ตนี้ได้ตามปกติ
                                                </AlertDescription>
                                            </Alert>
                                        ) : (
                                            <Alert className="border-destructive/50 bg-destructive/10">
                                                <AlertTriangle className="h-4 w-4 text-destructive" />
                                                <AlertTitle className="text-destructive font-bold">ยังไม่ได้ซิงค์ข้อมูล</AlertTitle>
                                                <AlertDescription className="text-foreground flex flex-col gap-3">
                                                    <span>กรุณาซิงค์ Twitch Token ผ่าน Chrome Extension เพื่อให้วิดเจ็ตสามารถส่งออกวิดีโอไปยัง YouTube ได้</span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-fit bg-secondary border-border hover:bg-secondary hover:text-primary"
                                                        onClick={() => controller.setActiveTab("quick-start")}
                                                    >
                                                        ไปที่หน้าติดตั้ง Extension
                                                    </Button>
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 border-b border-border pb-2">
                                            <YouTube className="w-5 h-5 text-primary" />
                                            <h3 className="text-lg font-semibold">ตั้งค่า YouTube</h3>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>ความเป็นส่วนตัว</Label>
                                            <SubLabel>กำหนดสถานะเริ่มต้นของวิดีโอที่ถูกส่งออกไปยัง YouTube</SubLabel>
                                            <YouTubePrivacySelect
                                                value={controller.privacyStatus}
                                                onValueChange={controller.setPrivacyStatus}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 border-b border-border pb-2">
                                            <Tags className="w-5 h-5 text-teal" />
                                            <h3 className="text-lg font-semibold">แท็กและรายละเอียดวิดีโอ</h3>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>คำอธิบายวิดีโอ</Label>
                                            <SubLabel>คำอธิบายที่คงที่สำหรับทุกวิดีโอที่คุณส่งออก</SubLabel>
                                            <CharacterCountTextarea
                                                maxLength={5000}
                                                placeholder="ใส่คำอธิบายที่จะใช้สำหรับวิดีโอที่ส่งออก..."
                                                rows={5}
                                                value={controller.description}
                                                onChange={(value) => controller.setDescription(value.slice(0, 5000))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>แท็ก</Label>
                                            <SubLabel>พิมพ์แท็กแล้วกด Enter หรือปุ่ม + เพื่อเพิ่มให้ทุกวิดีโอที่ส่งออก</SubLabel>
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
                                                {controller.tags?.map(tag => (
                                                    <Badge key={tag} variant="secondary" className="gap-1">
                                                        <span className="text-sm">{tag}</span>
                                                        <button type="button" aria-label={`ลบแท็ก ${tag}`} className="rounded-full hover:text-destructive" onClick={() => controller.handleRemoveTag(tag)}>
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                                {(!controller.tags || controller.tags.length === 0) && (
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
                                    <TestWidgetButton onTest={controller.handleTestExport} isLoading={controller.isTesting} />
                                    <SaveWidgetButton onSave={controller.handleSave} isLoading={controller.isSaving} />
                                </div>
                            </WidgetSettingsCardFooter>
                        </WidgetSettingsCard>
                    </TabsContent>

                    <TabsContent value="history">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-violet" />
                                    ประวัติการนำออก
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
            )}
        </WidgetConfigLayout>
    );
}
