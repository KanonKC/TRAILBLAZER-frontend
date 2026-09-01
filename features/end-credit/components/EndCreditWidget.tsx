"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { SmartOverlayUrlInput } from "@/components/widget/SmartOverlayUrlInput";
import { OBSSetupHelp } from "@/components/widget/OBSSetupHelp";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Gem, Heart, Radio, Star, Type, UserPlus, Users } from "lucide-react";
import WidgetOverviewCard from "@/components/widget/widget-tab-card/WidgetOverviewCard";
import WidgetQuickStartCard from "@/components/widget/widget-tab-card/WidgetQuickStartCard";
import { WidgetStepper } from "@/components/widget/WidgetStepper/WidgetStepper";
import WidgetStepperItems from "@/components/widget/WidgetStepper/WidgetStepperItems/WidgetStepperItems";
import WidgetEnabledBadge from "@/components/widget/WidgetEnabledBadge";
import WidgetSettingsCard from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCard";
import WidgetSettingsCardContent from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardContent";
import WidgetSettingsCardFooter from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardFooter";
import { DeleteWidgetButton } from "@/components/button/DeleteWidgetButton";
import { SaveWidgetButton } from "@/components/button/SaveWidgetButton";
import { TestWidgetButton } from "@/components/button/TestWidgetButton";
import { WidgetConfigLayout } from "@/components/widget/layout/WidgetConfigLayout";

import { useEndCredit } from "../hooks/useEndCredit";
import { EndCreditConfig } from "../types";
import { WidgetTypeMeta } from "@/services/widget.service";

interface CategoryCardProps {
    icon: React.ReactNode;
    iconClassName: string;
    title: string;
    enabled: boolean;
    onEnabledChange: (checked: boolean) => void;
    headerLabel: string;
    headerValue: string;
    onHeaderChange: (value: string) => void;
    countLabel?: string;
    countDescription?: string;
    countValue?: boolean;
    onCountChange?: (checked: boolean) => void;
}

/**
 * One category = one card: the master switch here is what actually decides whether
 * this section rolls at all — its header text and "show count" toggle only matter
 * when it's on, so they're disabled together rather than left editable but inert.
 */
interface CategoryToggleRowProps {
    icon: React.ReactNode;
    iconClassName: string;
    title: string;
    enabled: boolean;
    onEnabledChange: (checked: boolean) => void;
}

/** Toggle-only row for Quick Start step 2 — on/off per category, no header text or count options here. */
function CategoryToggleRow({ icon, iconClassName, title, enabled, onEnabledChange }: CategoryToggleRowProps) {
    return (
        <div className="flex items-center justify-between gap-3 p-3 border rounded-lg bg-card">
            <div className="flex items-center gap-3 min-w-0">
                <div className={cn("p-2 w-fit rounded-lg shrink-0", iconClassName)}>
                    {icon}
                </div>
                <Label className="text-sm font-medium">{title}</Label>
            </div>
            <Switch checked={enabled} onCheckedChange={onEnabledChange} />
        </div>
    );
}

function CategoryCard({
    icon,
    iconClassName,
    title,
    enabled,
    onEnabledChange,
    headerLabel,
    headerValue,
    onHeaderChange,
    countLabel,
    countDescription,
    countValue,
    onCountChange,
}: CategoryCardProps) {
    return (
        <div className={cn("border rounded-lg bg-card p-4 space-y-4 transition-opacity", !enabled && "opacity-60")}>
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={cn("p-2 w-fit rounded-lg shrink-0", iconClassName)}>
                        {icon}
                    </div>
                    <Label className="text-base font-semibold">{title}</Label>
                </div>
                <Switch checked={enabled} onCheckedChange={onEnabledChange} />
            </div>

            <div className="space-y-2">
                <Label className={cn(!enabled && "text-muted-foreground")}>{headerLabel}</Label>
                <Input
                    value={headerValue}
                    onChange={(e) => onHeaderChange(e.target.value)}
                    maxLength={500}
                    disabled={!enabled}
                />
            </div>

            {countLabel && (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-background/40">
                    <div className="space-y-0.5 mr-2">
                        <Label className={cn(!enabled && "text-muted-foreground")}>{countLabel}</Label>
                        <p className="text-sm text-muted-foreground">{countDescription}</p>
                    </div>
                    <Switch checked={!!countValue} onCheckedChange={onCountChange} disabled={!enabled} />
                </div>
            )}
        </div>
    );
}

export function EndCreditWidget({ initialConfig, widgetType }: { initialConfig: EndCreditConfig | null; widgetType: WidgetTypeMeta }) {
    const {
        user,
        config,
        followersHeader,
        subscribesHeader,
        raidsHeader,
        bitsHeader,
        isShowViewerAvatars,
        scrollSpeed,
        isShowFollowers,
        isShowSubs,
        isShowRaids,
        isShowBits,
        isShowSubMonths,
        isShowRaidCount,
        isShowBitsAmount,
        isEnabled,
        isSaving,
        isTesting,
        isUserLoading,
        activeTab,
        overlayUrl,
        setFollowersHeader,
        setSubscribesHeader,
        setRaidsHeader,
        setBitsHeader,
        setIsShowViewerAvatars,
        setScrollSpeed,
        setIsShowFollowers,
        setIsShowSubs,
        setIsShowRaids,
        setIsShowBits,
        setIsShowSubMonths,
        setIsShowRaidCount,
        setIsShowBitsAmount,
        setActiveTab,
        setConfig,
        handleEnable,
        handleSave,
        handleTest,
        handleDelete,
        handleStatusChange
    } = useEndCredit(initialConfig);

    if (isUserLoading) {
        return (
            <div className="container mx-auto py-10">
                <Skeleton className="h-[300px] w-full max-w-2xl mx-auto rounded-xl" />
            </div>
        )
    }

    return (
        <WidgetConfigLayout widgetType={widgetType}>
            {({ triggerRefresh }) => (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                        <WidgetOverviewCard
                            showLoginButton={!user}
                            showEnableButton={!!user && !config}
                            onClickEnable={async () => {
                                await handleEnable();
                                triggerRefresh();
                            }}
                            isLoading={isSaving}
                        >
                            <p className="text-gray-200 text-base leading-relaxed">
                                เมื่อคุณกด Raid ไปช่องอื่น วิดเจ็ตนี้จะเล่น Credit Roll บน Overlay โดยอัตโนมัติ
                                สรุปผู้ติดตามใหม่ สมาชิกใหม่ ผู้ที่ Raid เข้ามา และผู้สนับสนุน Bits ตลอดการสตรีมของคุณ เลื่อนขึ้นแบบเครดิตท้ายหนัง
                            </p>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                    <div className="p-2 w-fit rounded-lg bg-pink-500/10 text-pink-500 mb-3">
                                        <Heart className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold mb-1">เล่นอัตโนมัติเมื่อ Raid</h3>
                                    <p className="text-sm text-muted-foreground">เริ่ม Credit Roll ทันทีที่คุณกด Raid ไปช่องอื่น</p>
                                </div>
                                <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                    <div className="p-2 w-fit rounded-lg bg-purple-500/10 text-purple-500 mb-3">
                                        <Type className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold mb-1">ข้อความปรับแต่งได้</h3>
                                    <p className="text-sm text-muted-foreground">กำหนดหัวข้อของแต่ละหมวดหมู่ได้ตามต้องการ</p>
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
                                            title: "เลือกหมวดหมู่ที่จะแสดงใน Credit Roll",
                                            description: (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-white/70">
                                                        เปิดเฉพาะหมวดที่ต้องการให้แสดงในเครดิต หมวดที่ปิดไว้จะไม่ถูก Roll ขึ้นจอ
                                                        (ตั้งชื่อหัวข้อและตัวเลือกย่อยเพิ่มเติมได้ที่แท็บ Settings)
                                                    </p>
                                                    <div className="space-y-2">
                                                        <CategoryToggleRow
                                                            icon={<UserPlus className="w-4 h-4" />}
                                                            iconClassName="bg-violet-500/10 text-violet-500"
                                                            title="ผู้ติดตามใหม่"
                                                            enabled={isShowFollowers}
                                                            onEnabledChange={setIsShowFollowers}
                                                        />
                                                        <CategoryToggleRow
                                                            icon={<Star className="w-4 h-4" />}
                                                            iconClassName="bg-yellow-500/10 text-yellow-500"
                                                            title="สมาชิกใหม่"
                                                            enabled={isShowSubs}
                                                            onEnabledChange={setIsShowSubs}
                                                        />
                                                        <CategoryToggleRow
                                                            icon={<Radio className="w-4 h-4" />}
                                                            iconClassName="bg-orange-500/10 text-orange-500"
                                                            title="ผู้ที่ Raid เข้ามา"
                                                            enabled={isShowRaids}
                                                            onEnabledChange={setIsShowRaids}
                                                        />
                                                        <CategoryToggleRow
                                                            icon={<Gem className="w-4 h-4" />}
                                                            iconClassName="bg-teal-500/10 text-teal-500"
                                                            title="ผู้สนับสนุน Bits"
                                                            enabled={isShowBits}
                                                            onEnabledChange={setIsShowBits}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        },
                                        {
                                            step: 3,
                                            title: "เชื่อมต่อกับ OBS",
                                            description: (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-white/70">นำ Overlay URL ด้านล่างนี้ไปใส่ใน OBS ของคุณ (Browser Source) เพื่อให้ Credit Roll แสดงผลได้</p>
                                                    <SmartOverlayUrlInput url={overlayUrl} slug={"end-credit"} onSuccess={setConfig} />
                                                    <OBSSetupHelp />
                                                </div>
                                            )
                                        },
                                        {
                                            step: 4,
                                            title: "บันทึกและทดสอบ",
                                            description: (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-white/70">ตรวจสอบข้อมูลให้เรียบร้อยแล้วกดบันทึก จากนั้นกด Test เพื่อดู Credit Roll ตัวอย่างบน Overlay</p>
                                                    <div className="flex items-center gap-2">
                                                        <SaveWidgetButton onSave={handleSave} isLoading={isSaving} />
                                                        <TestWidgetButton onTest={handleTest} isLoading={isTesting} />
                                                    </div>
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
                            widgetId={config?.widget?.id}
                            isEnabled={isEnabled}
                            cost={config?.widget?.widget_type?.cost}
                            onStatusChange={handleStatusChange}
                            onSuccess={triggerRefresh}
                        >
                            <WidgetSettingsCardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 border-b pb-2">
                                        <Type className="w-5 h-5 text-purple-500" />
                                        <h3 className="text-lg font-semibold">หมวดหมู่ Credit Roll</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        เปิดเฉพาะหมวดที่ต้องการแสดงในเครดิต — หมวดที่ปิดไว้จะไม่ถูก Roll ขึ้นจอเลย
                                        และการตั้งค่าย่อยของหมวดนั้นจะถูกปิดใช้งานไปด้วย
                                    </p>
                                    <div className="space-y-3">
                                        <CategoryCard
                                            icon={<UserPlus className="w-5 h-5" />}
                                            iconClassName="bg-violet-500/10 text-violet-500"
                                            title="ผู้ติดตามใหม่"
                                            enabled={isShowFollowers}
                                            onEnabledChange={setIsShowFollowers}
                                            headerLabel="ข้อความหัวข้อ"
                                            headerValue={followersHeader}
                                            onHeaderChange={setFollowersHeader}
                                        />
                                        <CategoryCard
                                            icon={<Star className="w-5 h-5" />}
                                            iconClassName="bg-yellow-500/10 text-yellow-500"
                                            title="สมาชิกใหม่"
                                            enabled={isShowSubs}
                                            onEnabledChange={setIsShowSubs}
                                            headerLabel="ข้อความหัวข้อ"
                                            headerValue={subscribesHeader}
                                            onHeaderChange={setSubscribesHeader}
                                            countLabel="แสดงจำนวนเดือนที่สมัครสมาชิก"
                                            countDescription="แสดงจำนวนเดือนที่สมาชิกใหม่แต่ละคนสมัครสมาชิกต่อเนื่องมา"
                                            countValue={isShowSubMonths}
                                            onCountChange={setIsShowSubMonths}
                                        />
                                        <CategoryCard
                                            icon={<Radio className="w-5 h-5" />}
                                            iconClassName="bg-orange-500/10 text-orange-500"
                                            title="ผู้ที่ Raid เข้ามา"
                                            enabled={isShowRaids}
                                            onEnabledChange={setIsShowRaids}
                                            headerLabel="ข้อความหัวข้อ"
                                            headerValue={raidsHeader}
                                            onHeaderChange={setRaidsHeader}
                                            countLabel="แสดงจำนวนคนที่ Raid เข้ามา"
                                            countDescription="แสดงจำนวนผู้ชมที่ Raid มาด้วยควบคู่กับชื่อผู้ที่ Raid เข้ามา"
                                            countValue={isShowRaidCount}
                                            onCountChange={setIsShowRaidCount}
                                        />
                                        <CategoryCard
                                            icon={<Gem className="w-5 h-5" />}
                                            iconClassName="bg-teal-500/10 text-teal-500"
                                            title="ผู้สนับสนุน Bits"
                                            enabled={isShowBits}
                                            onEnabledChange={setIsShowBits}
                                            headerLabel="ข้อความหัวข้อ"
                                            headerValue={bitsHeader}
                                            onHeaderChange={setBitsHeader}
                                            countLabel="แสดงจำนวน Bits ทั้งหมดในสตรีมนี้"
                                            countDescription="แสดงจำนวน Bits รวมที่ผู้สนับสนุนแต่ละคนส่งเข้ามาตลอดสตรีมนี้"
                                            countValue={isShowBitsAmount}
                                            onCountChange={setIsShowBitsAmount}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 border-b pb-2">
                                        <Users className="w-5 h-5 text-blue-500" />
                                        <h3 className="text-lg font-semibold">ตัวเลือกทั่วไป</h3>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                        <div className="space-y-0.5">
                                            <Label>แสดงรูปโปรไฟล์ผู้ชม</Label>
                                            <p className="text-sm text-muted-foreground">แสดงรูปโปรไฟล์ของผู้ชมแต่ละคนควบคู่กับชื่อในเครดิต</p>
                                        </div>
                                        <Switch checked={isShowViewerAvatars} onCheckedChange={setIsShowViewerAvatars} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>ความเร็วการเลื่อนของเครดิต (px/วินาที)</Label>
                                        <div className="flex items-center gap-3">
                                            <Slider value={[scrollSpeed]} onValueChange={([v]) => setScrollSpeed(v)} min={20} max={200} step={5} className="flex-1" />
                                            <span className="text-sm tabular-nums w-16 text-right text-muted-foreground">{scrollSpeed} px/s</span>
                                        </div>
                                    </div>

                                    <SmartOverlayUrlInput
                                        url={overlayUrl}
                                        slug="end-credit"
                                        onSuccess={setConfig}
                                    />
                                    <OBSSetupHelp />
                                </div>
                            </WidgetSettingsCardContent>
                            <WidgetSettingsCardFooter>
                                <DeleteWidgetButton onDelete={handleDelete} isLoading={isSaving} />
                                <div className="flex gap-2">
                                    <TestWidgetButton onTest={handleTest} isLoading={isTesting} />
                                    <SaveWidgetButton onSave={handleSave} isLoading={isSaving} />
                                </div>
                            </WidgetSettingsCardFooter>
                        </WidgetSettingsCard>
                    </TabsContent>
                </Tabs>
            )}
        </WidgetConfigLayout>
    );
}
