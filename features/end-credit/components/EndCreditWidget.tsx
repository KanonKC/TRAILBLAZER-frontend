"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SmartOverlayUrlInput } from "@/components/widget/SmartOverlayUrlInput";
import { OBSSetupHelp } from "@/components/widget/OBSSetupHelp";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Heart, Type, Users } from "lucide-react";
import WidgetOverviewCard from "@/components/widget/widget-tab-card/WidgetOverviewCard";
import WidgetSettingsCard from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCard";
import WidgetSettingsCardContent from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardContent";
import WidgetSettingsCardFooter from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardFooter";
import { DeleteWidgetButton } from "@/components/button/DeleteWidgetButton";
import { SaveWidgetButton } from "@/components/button/SaveWidgetButton";
import { WidgetConfigLayout } from "@/components/widget/layout/WidgetConfigLayout";

import { useEndCredit } from "../hooks/useEndCredit";
import { EndCreditConfig } from "../types";
import { WidgetTypeMeta } from "@/services/widget.service";

export function EndCreditWidget({ initialConfig, widgetType }: { initialConfig: EndCreditConfig | null; widgetType: WidgetTypeMeta }) {
    const {
        user,
        config,
        followersHeader,
        subscribesHeader,
        raidsHeader,
        bitsHeader,
        viewersHeader,
        isShowViewerAvatars,
        isEnabled,
        isSaving,
        isUserLoading,
        activeTab,
        overlayUrl,
        setFollowersHeader,
        setSubscribesHeader,
        setRaidsHeader,
        setBitsHeader,
        setViewersHeader,
        setIsShowViewerAvatars,
        setActiveTab,
        setConfig,
        handleEnable,
        handleSave,
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
                    <TabsList className={cn("grid w-full mb-4", config ? "grid-cols-2" : "grid-cols-1")}>
                        <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
                        {config && (
                            <TabsTrigger value="settings" className="cursor-pointer">Settings</TabsTrigger>
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
                                แสดงเครดิตท้ายสตรีมสรุปผู้ติดตามใหม่ สมาชิกใหม่ ผู้ที่ Raid เข้ามา และผู้สนับสนุน Bits ตลอดการสตรีมของคุณ
                                นำ Overlay ไปวางในฉาก &quot;จบสตรีม&quot; ของ OBS เพื่อขอบคุณผู้ชมได้อย่างมืออาชีพ
                            </p>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                    <div className="p-2 w-fit rounded-lg bg-pink-500/10 text-pink-500 mb-3">
                                        <Heart className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold mb-1">สรุปกิจกรรมท้ายสตรีม</h3>
                                    <p className="text-sm text-muted-foreground">รวบรวมผู้ติดตาม สมาชิก การ Raid และ Bits ตลอดสตรีม</p>
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
                                        <h3 className="text-lg font-semibold">หัวข้อแต่ละหมวดหมู่</h3>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>ผู้ติดตามใหม่</Label>
                                            <Input value={followersHeader} onChange={(e) => setFollowersHeader(e.target.value)} maxLength={500} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>สมาชิกใหม่</Label>
                                            <Input value={subscribesHeader} onChange={(e) => setSubscribesHeader(e.target.value)} maxLength={500} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>ผู้ที่ Raid เข้ามา</Label>
                                            <Input value={raidsHeader} onChange={(e) => setRaidsHeader(e.target.value)} maxLength={500} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>ผู้สนับสนุน Bits</Label>
                                            <Input value={bitsHeader} onChange={(e) => setBitsHeader(e.target.value)} maxLength={500} />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label>ผู้ชมในสตรีมนี้</Label>
                                            <Input value={viewersHeader} onChange={(e) => setViewersHeader(e.target.value)} maxLength={500} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 border-b pb-2">
                                        <Users className="w-5 h-5 text-blue-500" />
                                        <h3 className="text-lg font-semibold">ตัวเลือกการแสดงผล</h3>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                        <div className="space-y-0.5">
                                            <Label>แสดงรูปโปรไฟล์ผู้ชม</Label>
                                            <p className="text-sm text-muted-foreground">แสดงรูปโปรไฟล์ของผู้ชมแต่ละคนควบคู่กับชื่อในเครดิต</p>
                                        </div>
                                        <Switch checked={isShowViewerAvatars} onCheckedChange={setIsShowViewerAvatars} />
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
                                <SaveWidgetButton onSave={handleSave} isLoading={isSaving} />
                            </WidgetSettingsCardFooter>
                        </WidgetSettingsCard>
                    </TabsContent>
                </Tabs>
            )}
        </WidgetConfigLayout>
    );
}
