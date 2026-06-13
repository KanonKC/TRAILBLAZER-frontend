import { useState } from "react";
import { useUser } from "@/components/user-context";
import { tbToast } from "@/utils/tbToast";
import { createSpotifySongRequest, updateSpotifySongRequestConfig } from "../api/spotifySongRequest.api";
import { deleteWidget } from "@/services/widget.service";
import { SpotifySongRequestConfig } from "../types";

export const useSpotifySongRequest = (initialConfig: SpotifySongRequestConfig | null) => {
    const { user, isLoading: isUserLoading } = useUser();
    const [config, setConfig] = useState<SpotifySongRequestConfig | null>(initialConfig);
    const [isEnabled, setIsEnabled] = useState(initialConfig?.widget?.enabled ?? false);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState(initialConfig ? "settings" : "overview");

    // Form fields
    const [twitchRewardId, setTwitchRewardId] = useState<string | null>(initialConfig?.twitch_reward_id ?? null);
    const [twitchBotId, setTwitchBotId] = useState<string>(initialConfig?.twitch_bot_id ?? "");
    const [invalidMessage, setInvalidMessage] = useState<string>(initialConfig?.invalid_message ?? "");
    const [successMessage, setSuccessMessage] = useState<string>(initialConfig?.success_message ?? "");

    const handleEnable = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const data = await createSpotifySongRequest(user.twitchId, user.id);
            tbToast.success({ title: "เปิดใช้งานสำเร็จ" });
            setConfig(data);
            setIsEnabled(data.widget?.enabled ?? false);
            setTwitchRewardId(data.twitch_reward_id);
            setTwitchBotId(data.twitch_bot_id ?? "");
            setInvalidMessage(data.invalid_message ?? "");
            setSuccessMessage(data.success_message ?? "");
            setActiveTab("settings");
        } catch (error) {
            console.error("Failed to enable", error);
            tbToast.error({ title: "เปิดใช้งานไม่สำเร็จ" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = async () => {
        if (!config) return;
        setIsSaving(true);
        try {
            const updated = await updateSpotifySongRequestConfig({
                twitch_reward_id: twitchRewardId,
                twitch_bot_id: twitchBotId || null,
                invalid_message: invalidMessage || null,
                success_message: successMessage || null,
            });
            tbToast.success({ title: "บันทึกการตั้งค่าสำเร็จ" });
            setConfig(updated);
        } catch (error: any) {
            console.error("Failed to save", error);
            tbToast.error({ title: "ไม่สามารถบันทึกการตั้งค่าได้", error: error.response?.data });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!config?.widget?.id) return;
        setIsSaving(true);
        try {
            const success = await deleteWidget(config.widget.id);
            if (success) {
                tbToast.success({ title: "ลบวิดเจ็ตสำเร็จ" });
                setConfig(null);
                setIsEnabled(false);
                setTwitchRewardId(null);
                setTwitchBotId("");
                setInvalidMessage("");
                setSuccessMessage("");
                setActiveTab("overview");
            }
        } catch (error) {
            console.error("Failed to delete", error);
            tbToast.error({ title: "ไม่สามารถลบวิดเจ็ตได้" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleStatusChange = (checked: boolean) => {
        setIsEnabled(checked);
        setConfig(prev => prev ? { ...prev, widget: { ...prev.widget, enabled: checked } } : null);
    };

    return {
        user,
        config,
        isEnabled,
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
        setConfig,
        handleEnable,
        handleSave,
        handleDelete,
        handleStatusChange,
    };
};
