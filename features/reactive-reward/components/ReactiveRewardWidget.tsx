"use client";

import { Clapperboard, Gift, Layers, ListOrdered, Monitor, Plus, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { DeleteWidgetButton } from "@/components/button/DeleteWidgetButton";
import { TestWidgetButton } from "@/components/button/TestWidgetButton";
import { OBSSetupHelp } from "@/components/widget/OBSSetupHelp";
import { SmartOverlayUrlInput } from "@/components/widget/SmartOverlayUrlInput";
import { WidgetStepper } from "@/components/widget/WidgetStepper/WidgetStepper";
import WidgetStepperItems from "@/components/widget/WidgetStepper/WidgetStepperItems/WidgetStepperItems";
import { WidgetEnableStepContent, WidgetOverlayStepContent, WidgetSettingsStepContent } from "@/components/widget/WidgetSetupStepContent";
import { WidgetQuotaDialog } from "@/components/widget/WidgetQuotaDialog";
import { WidgetConfigLayout } from "@/components/widget/layout/WidgetConfigLayout";
import WidgetOverviewCard from "@/components/widget/widget-tab-card/WidgetOverviewCard";
import WidgetQuickStartCard from "@/components/widget/widget-tab-card/WidgetQuickStartCard";
import WidgetSettingsCard from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCard";
import WidgetSettingsCardContent from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardContent";
import WidgetSettingsCardFooter from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardFooter";
import type { WidgetTypeMeta } from "@/services/widget.service";
import { MAX_REACTIONS, WIDGET_SLUG } from "../constants";
import { useReactiveReward } from "../hooks/useReactiveReward";
import type { ReactiveRewardConfig } from "../types";
import { ReactionGrid } from "./ReactionGrid";
import { ReactionUsageBar } from "./ReactionUsageBar";
import { ReactionSheet } from "./ReactionSheet";

export function ReactiveRewardWidget({ initialConfig, widgetType }: { initialConfig: ReactiveRewardConfig | null; widgetType: WidgetTypeMeta }) {
    const reward = useReactiveReward(initialConfig);
    const { config, isEnabled, isSaving, isTesting, activeTab, setActiveTab, setConfig, handleStatusChange } = reward;
    const firstReaction = reward.reactions[0];

    if (reward.isUserLoading) {
        return (
            <div className="container mx-auto py-10">
                <Skeleton className="mx-auto h-[300px] w-full max-w-2xl rounded-xl" />
            </div>
        );
    }

    return (
        <WidgetConfigLayout widgetType={widgetType} quotaRefreshKey={reward.quotaVersion}>
            {({ triggerRefresh }) => (
                <>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className={cn("mb-4 grid w-full", config ? "grid-cols-3" : "grid-cols-1")}>
                            <TabsTrigger value="overview" className="cursor-pointer">ภาพรวม</TabsTrigger>
                            {config && (
                                <>
                                    <TabsTrigger value="quick-start" className="cursor-pointer">เริ่มต้นใช้งาน</TabsTrigger>
                                    <TabsTrigger value="settings" className="cursor-pointer">ตั้งค่า</TabsTrigger>
                                </>
                            )}
                        </TabsList>

                        <TabsContent value="overview">
                            <WidgetOverviewCard
                                showLoginButton={!reward.user}
                                showEnableButton={!!reward.user && !config}
                                onClickEnable={async () => {
                                    await reward.handleEnable();
                                    triggerRefresh();
                                }}
                                isLoading={isSaving}
                            >
                                <p className="text-foreground text-base leading-relaxed">
                                    เมื่อผู้ชมแลกแต้มช่อง วิดเจ็ตนี้จะเล่นรูป เสียง หรือวิดีโอที่คุณเลือกบนหน้าจอสตรีมทันที ตั้งได้หลายแต้มช่องในวิดเจ็ตเดียว และใช้ลิงก์ OBS แค่ลิงก์เดียว
                                </p>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="bg-card rounded-xl border p-4">
                                        <div className="bg-teal/10 text-teal mb-3 w-fit rounded-lg p-2">
                                            <Gift className="h-5 w-5" />
                                        </div>
                                        <h3 className="mb-1 font-semibold">Channel Points</h3>
                                        <p className="text-muted-foreground text-sm">ผูกแต้มช่องแต่ละอันกับสิ่งที่อยากให้เล่น ผู้ชมแลกแล้วขึ้นจอได้เลย</p>
                                    </div>
                                    <div className="bg-card rounded-xl border p-4">
                                        <div className="bg-violet/10 text-violet mb-3 w-fit rounded-lg p-2">
                                            <Clapperboard className="h-5 w-5" />
                                        </div>
                                        <h3 className="mb-1 font-semibold">รูป เสียง และวิดีโอ</h3>
                                        <p className="text-muted-foreground text-sm">เลือกตำแหน่งและขนาดบนหน้าจอเองได้ หรือเล่นรูปคู่กับเสียง</p>
                                    </div>
                                    <div className="bg-card rounded-xl border p-4">
                                        <div className="bg-info/10 text-info mb-3 w-fit rounded-lg p-2">
                                            <ListOrdered className="h-5 w-5" />
                                        </div>
                                        <h3 className="mb-1 font-semibold">เล่นทีละรายการ</h3>
                                        <p className="text-muted-foreground text-sm">ถ้ามีคนแลกพร้อมกันหลายคน ระบบเล่นต่อคิวให้ ไม่ทับกัน</p>
                                    </div>
                                    <div className="bg-card rounded-xl border p-4">
                                        <div className="bg-supernova/10 text-supernova mb-3 w-fit rounded-lg p-2">
                                            <Layers className="h-5 w-5" />
                                        </div>
                                        <h3 className="mb-1 font-semibold">สูงสุด {MAX_REACTIONS} Reaction</h3>
                                        <p className="text-muted-foreground text-sm">ใช้โควตาวิดเจ็ตเพียง 1 ช่อง ไม่ว่าจะมีกี่ Reaction</p>
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
                                                description: <WidgetEnableStepContent description="เปิดวิดเจ็ตนี้เพื่อให้ผู้ชมแลกแต้มช่องแล้วมีรูป เสียง หรือวิดีโอขึ้นบนหน้าจอสตรีมของคุณ" />,
                                            },
                                            {
                                                step: 2,
                                                title: "สร้าง Reaction แรก",
                                                description: (
                                                    <div className="space-y-3">
                                                        <p className="text-muted-foreground text-sm">เลือกแต้มช่อง แล้วเลือกรูป เสียง หรือวิดีโอที่จะเล่นเมื่อมีคนแลก</p>
                                                        <Button type="button" onClick={reward.openNewReaction} disabled={!reward.canAddReaction}>
                                                            <Plus />
                                                            {reward.reactions.length === 0 ? "เพิ่ม Reaction" : "เพิ่ม Reaction อีกอัน"}
                                                        </Button>
                                                        {reward.reactions.length > 0 && (
                                                            <p className="text-success text-sm">มี Reaction แล้ว {reward.reactions.length} รายการ</p>
                                                        )}
                                                    </div>
                                                ),
                                            },
                                            {
                                                step: 3,
                                                title: "นำโอเวอร์เลย์ไปใส่ใน OBS",
                                                description: (
                                                    <WidgetOverlayStepContent
                                                        description="นำลิงก์นี้ไปใส่ใน Browser Source ของ OBS เพื่อให้ Reaction ขึ้นบนหน้าจอสตรีมของคุณ"
                                                        url={reward.overlayUrl}
                                                        slug={WIDGET_SLUG}
                                                        onSuccess={setConfig}
                                                        obsType="video"
                                                    />
                                                ),
                                            },
                                            {
                                                step: 4,
                                                title: "ทดสอบ",
                                                description: (
                                                    <div className="space-y-3">
                                                        <p className="text-muted-foreground text-sm">เปิดลิงก์โอเวอร์เลย์ใน OBS ก่อน แล้วกดทดสอบเพื่อดูว่า Reaction แรกขึ้นบนหน้าจอถูกต้อง</p>
                                                        <TestWidgetButton
                                                            onTest={() => firstReaction && reward.handleTestReaction(firstReaction.id)}
                                                            isLoading={isTesting}
                                                            disabled={!firstReaction}
                                                        />
                                                    </div>
                                                ),
                                            },
                                            {
                                                step: 5,
                                                title: "จัดการ Reaction ทั้งหมด",
                                                description: (
                                                    <WidgetSettingsStepContent
                                                        description="เพิ่ม แก้ไข ปิด หรือลบ Reaction และดูลิงก์โอเวอร์เลย์ได้ในแท็บตั้งค่า"
                                                        onOpenSettings={() => setActiveTab("settings")}
                                                    />
                                                ),
                                            },
                                        ]}
                                    />
                                </WidgetStepper>
                            </WidgetQuickStartCard>
                        </TabsContent>

                        <TabsContent value="settings">
                            <WidgetSettingsCard
                                widgetId={config?.widget?.id}
                                isEnabled={isEnabled}
                                cost={reward.pointsNeeded}
                                onStatusChange={handleStatusChange}
                                onSuccess={triggerRefresh}
                            >
                                <WidgetSettingsCardContent>
                                    <div className="space-y-8">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-2 border-b pb-2">
                                                <Monitor className="text-teal h-5 w-5" />
                                                <h3 className="text-lg font-semibold">โอเวอร์เลย์</h3>
                                            </div>
                                            <SmartOverlayUrlInput url={reward.overlayUrl} slug={WIDGET_SLUG} onSuccess={setConfig} />
                                            <OBSSetupHelp type="video" />
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between gap-2 border-b pb-2">
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className="text-supernova h-5 w-5" />
                                                    <h3 className="text-lg font-semibold">Reaction</h3>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {reward.reactions.length > 0 && (
                                                        <Button type="button" size="sm" onClick={reward.openNewReaction} disabled={!reward.canAddReaction}>
                                                            <Plus />
                                                            เพิ่ม Reaction
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                            <ReactionUsageBar total={reward.reactions.length} active={reward.activeCount} />
                                            <ReactionGrid
                                                reactions={reward.reactions}
                                                rewardsById={reward.rewardsById}
                                                rewardsLoaded={!reward.isRewardsLoading && reward.rewards.length > 0}
                                                busyReactionId={reward.busyReactionId}
                                                canAdd={reward.canAddReaction}
                                                onAdd={reward.openNewReaction}
                                                onEdit={reward.openReaction}
                                                onToggle={reward.handleToggleReaction}
                                                onTest={reward.handleTestReaction}
                                            />
                                        </div>
                                    </div>
                                </WidgetSettingsCardContent>
                                <WidgetSettingsCardFooter>
                                    <DeleteWidgetButton onDelete={reward.handleDelete} isLoading={isSaving} />
                                </WidgetSettingsCardFooter>
                            </WidgetSettingsCard>
                        </TabsContent>
                    </Tabs>

                    <ReactionSheet
                        editing={reward.editing}
                        rewards={reward.rewards}
                        isRewardsLoading={reward.isRewardsLoading}
                        rewardUsedBy={reward.rewardUsedBy}
                        onSave={reward.handleSaveReaction}
                        onDelete={reward.handleDeleteReaction}
                        onTest={reward.handleTestReaction}
                        isTesting={isTesting}
                        canEnableMore={reward.canEnableMoreReactions}
                        onQuotaFull={reward.openLimitDialog}
                        onClose={reward.closeReaction}
                    />
                    <WidgetQuotaDialog
                        open={reward.showLimitDialog}
                        onOpenChange={reward.setShowLimitDialog}
                        enabledWidgets={reward.limitDialogWidgets}
                        onDisableWidget={reward.handleDisableOtherWidget}
                    />
                </>
            )}
        </WidgetConfigLayout>
    );
}
