import { useState, useEffect } from "react";
import { useUser } from "@/components/user-context";
import { useWidgetLifecycleState } from "@/hooks/use-widget-lifecycle-state";
import { tbToast } from "@/utils/tbToast";
import { 
    enableDropImage, 
    updateDropImageConfig, 
    refreshDropImageKey, 
    testDropImage 
} from "../api/dropImage.api";
import { deleteWidget } from "@/services/widget.service";
import { DropImageConfig } from "../types";
import { useTwitchRewards } from "@/hooks/use-twitch-rewards";

export const useDropImage = (initialConfig: DropImageConfig | null) => {
    const { user, isLoading: isUserLoading } = useUser();
    const { config, setConfig, isEnabled, setIsEnabled, isSaving, setIsSaving, isTesting, setIsTesting, activeTab, setActiveTab, handleStatusChange, runSaving, runTesting } = useWidgetLifecycleState(initialConfig);

    // Form states
    const [twitchRewardId, setTwitchRewardId] = useState<string | null>(initialConfig?.twitch_reward_id || null);
    const [displayDuration, setDisplayDuration] = useState<number>(initialConfig?.display_duration || 5);
    const [enabledModeration, setEnabledModeration] = useState(initialConfig?.enabled_moderation ?? true);
    const [botProfile, setBotProfile] = useState<string>(initialConfig?.twitch_bot_id || user?.twitchId || "");
    const [invalidMessage, setInvalidMessage] = useState<string>(initialConfig?.invalid_message || "");
    const [notImageMessage, setNotImageMessage] = useState<string>(initialConfig?.not_image_message || "");
    const [containMatureMessage, setContainMatureMessage] = useState<string>(initialConfig?.contain_mature_message || "");

    const overlayUrl = typeof window !== 'undefined' && user
        ? `${window.location.origin}/overlays/drop-image/${user.id}${config?.widget && config.widget.overlay_key ? `?key=${config.widget.overlay_key}` : ''}`
        : "";

    useEffect(() => {
        if (!initialConfig && user?.twitchId) {
            setBotProfile(user.twitchId);
        }
    }, [user?.twitchId, initialConfig]);

    const handleEnable = async () => {
        if (!user) return;
        await runSaving(async () => {
            const data = await enableDropImage(true);
            if (data) {
                tbToast.success({ title: "เปิดใช้งานสำเร็จ" });
                setConfig(data);
                setIsEnabled(data.widget?.enabled ?? false);
                setTwitchRewardId(data.twitch_reward_id);
                setDisplayDuration(data.display_duration);
                setEnabledModeration(data.enabled_moderation ?? true);
                setBotProfile(data.twitch_bot_id || user.twitchId);
                setInvalidMessage(data.invalid_message || "");
                setNotImageMessage(data.not_image_message || "");
                setContainMatureMessage(data.contain_mature_message || "");
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
                setDisplayDuration(5);
                setEnabledModeration(true);
                setBotProfile("");
                setInvalidMessage("");
                setNotImageMessage("");
                setContainMatureMessage("");
                setActiveTab("overview");
            }
        }, "ลบวิดเจ็ตไม่สำเร็จ", "Failed to delete");
    };

    const handleSave = async () => {
        if (!config) return;
        await runSaving(async () => {
            const updated = await updateDropImageConfig({
                twitch_reward_id: twitchRewardId,
                display_duration: displayDuration,
                enabled_moderation: enabledModeration,
                twitch_bot_id: botProfile === "default" ? null : botProfile,
                invalid_message: invalidMessage || null,
                not_image_message: notImageMessage || null,
                contain_mature_message: containMatureMessage || null,
            });

            if (updated) {
                tbToast.success({ title: "บันทึกการตั้งค่าสำเร็จ" });
                setConfig(updated);
            }
        }, "บันทึกการตั้งค่าไม่สำเร็จ", "Failed to update config");
    };

    const handleTest = async () => {
        if (!user || isTesting) return;

        let rewardId = twitchRewardId || "test-reward-id";

        await runTesting(async () => {
            const mockEvent = {
                subscription: { status: "enabled", type: "channel.chat.message" },
                event: {
                    broadcaster_user_id: user.twitchId,
                    broadcaster_user_login: user.username,
                    broadcaster_user_name: user.displayName,
                    chatter_user_id: user.twitchId,
                    chatter_user_login: user.username,
                    chatter_user_name: user.displayName,
                    message_id: "test-message-id-" + Date.now(),
                    message: {
                        text: "https://hips.hearstapps.com/hmg-prod/images/summer-flowers-1648478322.jpg",
                        fragments: [{
                            type: "text",
                            text: "https://hips.hearstapps.com/hmg-prod/images/summer-flowers-1648478322.jpg",
                            cheermote: null,
                            emote: null,
                            mention: null
                        }]
                    },
                    color: "",
                    badges: [],
                    message_type: "text",
                    cheer: null,
                    reply: null,
                    channel_points_custom_reward_id: rewardId,
                    source_broadcaster_user_id: null,
                    source_broadcaster_user_login: null,
                    source_broadcaster_user_name: null,
                    source_message_id: null,
                    source_badges: null
                }
            };

            await testDropImage(mockEvent);
            tbToast.success({ title: "ทดสอบวิดเจ็ตสำเร็จ" });
        }, "ทดสอบวิดเจ็ตไม่สำเร็จ", "Test failed:");
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
        displayDuration,
        enabledModeration,
        botProfile,
        invalidMessage,
        notImageMessage,
        containMatureMessage,
        overlayUrl,
        setTwitchRewardId,
        setDisplayDuration,
        setEnabledModeration,
        setBotProfile,
        setInvalidMessage,
        setNotImageMessage,
        setContainMatureMessage,
        setActiveTab,
        setConfig,
        handleEnable,
        handleDelete,
        handleSave,
        handleTest,
        handleStatusChange
    };
};
