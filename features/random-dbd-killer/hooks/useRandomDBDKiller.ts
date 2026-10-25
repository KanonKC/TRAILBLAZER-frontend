import { useState, useEffect } from "react";
import { useUser } from "@/components/user-context";
import { useWidgetLifecycleState } from "@/hooks/use-widget-lifecycle-state";
import { tbToast } from "@/utils/tbToast";
import {
    enableRandomDBDKiller,
    updateRandomDBDKillerConfig,
    testRandomDBDKiller,
    getDBDKillerMasterList
} from "../api/randomDBDKiller.api";
import { deleteWidget } from "@/services/widget.service";
import { RandomDBDKillerConfig, DBDKillerMaster, RandomDBDKillerAnimationStyle } from "../types";
import { DEFAULT_ANIMATION_STYLE } from "../constants";

export const useRandomDBDKiller = (initialConfig: RandomDBDKillerConfig | null) => {
    const { user, isLoading: isUserLoading } = useUser();
    const { config, setConfig, isEnabled, setIsEnabled, isSaving, setIsSaving, isTesting, setIsTesting, activeTab, setActiveTab, handleStatusChange, runSaving, runTesting } = useWidgetLifecycleState(initialConfig);

    const [twitchRewardId, setTwitchRewardId] = useState<string | null>(initialConfig?.twitch_reward_id || null);
    const [killerPool, setKillerPool] = useState<string[]>(initialConfig?.killer_pool || []);
    const [animationStyle, setAnimationStyle] = useState<RandomDBDKillerAnimationStyle>(initialConfig?.animation_style || DEFAULT_ANIMATION_STYLE);
    const [killerMasters, setKillerMasters] = useState<DBDKillerMaster[]>([]);
    const [isLoadingKillerMasters, setIsLoadingKillerMasters] = useState(true);

    const overlayUrl = typeof window !== 'undefined' && user
        ? `${window.location.origin}/overlays/random-dbd-killer/${user.id}${config?.widget && config.widget.overlay_key ? `?key=${config.widget.overlay_key}` : ''}`
        : "";

    useEffect(() => {
        getDBDKillerMasterList()
            .then(setKillerMasters)
            .catch((error) => console.error("Failed to load killer master list", error))
            .finally(() => setIsLoadingKillerMasters(false));
    }, []);

    const toggleKiller = (slug: string) => {
        setKillerPool(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
    };

    const handleEnable = async () => {
        if (!user) return;
        await runSaving(async () => {
            const data = await enableRandomDBDKiller();
            if (data) {
                tbToast.success({ title: "เปิดใช้งานสำเร็จ" });
                setConfig(data);
                setIsEnabled(data.widget?.enabled ?? false);
                setTwitchRewardId(data.twitch_reward_id);
                setKillerPool(data.killer_pool || []);
                setAnimationStyle(data.animation_style || DEFAULT_ANIMATION_STYLE);
                setActiveTab("quick-start");
            }
        }, "เปิดใช้งานไม่สำเร็จ", "Failed to enable");
    };

    const handleDelete = async () => {
        if (!config?.widget?.id) return;
        await runSaving(async () => {
            const success = await deleteWidget(config.widget.id);
            if (success) {
                tbToast.success({ title: "ลบวิดเจ็ตสำเร็จ" });
                setConfig(null);
                setIsEnabled(false);
                setTwitchRewardId(null);
                setKillerPool([]);
                setActiveTab("overview");
            }
        }, "ลบวิดเจ็ตไม่สำเร็จ", "Failed to delete");
    };

    const handleSave = async () => {
        if (!config) return;
        await runSaving(async () => {
            const updated = await updateRandomDBDKillerConfig({
                twitch_reward_id: twitchRewardId ?? undefined,
                killer_pool: killerPool,
                animation_style: animationStyle,
            });
            if (updated) {
                tbToast.success({ title: "บันทึกการตั้งค่าสำเร็จ" });
                setConfig(updated);
                setKillerPool(updated.killer_pool || []);
                setAnimationStyle(updated.animation_style || DEFAULT_ANIMATION_STYLE);
            }
        }, "บันทึกการตั้งค่าไม่สำเร็จ", "Failed to save");
    };

    const handleTest = async () => {
        if (!user || isTesting) return;
        const rewardId = twitchRewardId || "test-reward-id";

        await runTesting(async () => {
            const mockEvent = {
                subscription: { status: "enabled", type: "channel.channel_points_custom_reward_redemption.add" },
                event: {
                    id: "test-redemption-id-" + Date.now(),
                    broadcaster_user_id: user.twitchId,
                    broadcaster_user_login: user.username,
                    broadcaster_user_name: user.displayName,
                    user_id: user.twitchId,
                    user_login: user.username,
                    user_name: user.displayName,
                    user_input: "",
                    status: "unfulfilled",
                    reward: { id: rewardId, title: "Test Random Killer", cost: 1, prompt: "" },
                    redeemed_at: new Date().toISOString()
                }
            };
            await testRandomDBDKiller(mockEvent);
            tbToast.success({ title: "ทดสอบวิดเจ็ตสำเร็จ" });
        }, "ทดสอบวิดเจ็ตไม่สำเร็จ", "Test failed");
    };


    return {
        user,
        config,
        isEnabled,
        isSaving,
        isTesting,
        isUserLoading,
        activeTab,
        twitchRewardId,
        killerPool,
        animationStyle,
        killerMasters,
        isLoadingKillerMasters,
        overlayUrl,
        setTwitchRewardId,
        setAnimationStyle,
        toggleKiller,
        setActiveTab,
        setConfig,
        handleEnable,
        handleDelete,
        handleSave,
        handleTest,
        handleStatusChange
    };
};
