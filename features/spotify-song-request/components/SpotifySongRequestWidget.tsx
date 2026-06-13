"use client"

import { useSpotifySongRequest } from "../hooks/useSpotifySongRequest";
import { Skeleton } from "@/components/ui/skeleton";
import { Music } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import WidgetOverviewCard from "@/components/widget/widget-tab-card/WidgetOverviewCard";
import WidgetSettingsCard from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCard";
import WidgetSettingsCardContent from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardContent";
import WidgetSettingsCardFooter from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardFooter";
import { TwitchRewardSelector } from "@/components/widget/TwitchRewardSelector";
import { BotProfileSelector } from "@/components/widget/BotProfileSelector";
import { ReplyMessageTextarea } from "@/components/widget/ReplyMessageTextarea";
import { SaveWidgetButton } from "@/components/button/SaveWidgetButton";
import { DeleteWidgetButton } from "@/components/button/DeleteWidgetButton";
import { WidgetConfigLayout } from "@/components/widget/layout/WidgetConfigLayout";
import { Label } from "@/components/ui/label";
import { SpotifySongRequestConfig } from "../types";

export function SpotifySongRequestWidget({ initialConfig }: { initialConfig: SpotifySongRequestConfig | null }) {
    const {
        user,
        config,
        isSaving,
        isUserLoading,
        activeTab,
        twitchRewardId,
        twitchBotId,
        invalidMessage,
        successMessage,
        setTwitchRewardId,
        setTwitchBotId,
        setInvalidMessage,
        setSuccessMessage,
        setActiveTab,
        handleEnable,
        handleSave,
        handleDelete,
    } = useSpotifySongRequest(initialConfig);

    if (isUserLoading) {
        return (
            <div className="container mx-auto py-10">
                <Skeleton className="h-[300px] w-full max-w-2xl mx-auto rounded-xl" />
            </div>
        );
    }

    return (
        <WidgetConfigLayout
            title="Spotify Song Request"
            description="ให้ผู้ชมของคุณขอเพลง Spotify ผ่านการแลกแต้มช่อง บอทจะเพิ่มเพลงเข้าคิวและตอบกลับในแชท"
            icon={<Music className="w-6 h-6" />}
            iconClassName="bg-green-500/10 text-green-500"
        >
            {() => (
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
                            onClickEnable={handleEnable}
                            isLoading={isSaving}
                        />
                    </TabsContent>

                    {config && (
                        <TabsContent value="settings">
                            <WidgetSettingsCard>
                                <WidgetSettingsCardContent>
                                    <TwitchRewardSelector
                                        value={twitchRewardId}
                                        onValueChange={setTwitchRewardId}
                                    />
                                    <BotProfileSelector
                                        value={twitchBotId}
                                        onValueChange={setTwitchBotId}
                                    />
                                    <div className="space-y-2">
                                        <Label>ข้อความเมื่อสำเร็จ</Label>
                                        <ReplyMessageTextarea
                                            value={successMessage}
                                            onChange={setSuccessMessage}
                                            placeholder="เพิ่ม {{track_name}} โดย {{track_artist}} เข้าคิวแล้ว!"
                                            rows={2}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ข้อความเมื่อไม่พบเพลง</Label>
                                        <ReplyMessageTextarea
                                            value={invalidMessage}
                                            onChange={setInvalidMessage}
                                            placeholder="ไม่พบเพลงที่ต้องการ กรุณาลองใหม่อีกครั้ง"
                                            rows={2}
                                        />
                                    </div>
                                </WidgetSettingsCardContent>
                                <WidgetSettingsCardFooter>
                                    <SaveWidgetButton onSave={handleSave} isLoading={isSaving} />
                                    <DeleteWidgetButton onDelete={handleDelete} isLoading={isSaving} />
                                </WidgetSettingsCardFooter>
                            </WidgetSettingsCard>
                        </TabsContent>
                    )}
                </Tabs>
            )}
        </WidgetConfigLayout>
    );
}
