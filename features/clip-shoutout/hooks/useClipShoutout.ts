import { useState, useEffect } from "react";
import { useUser } from "@/components/user-context";
import { tbToast } from "@/utils/tbToast";
import { z } from "zod";
import {
    enableClipShoutout,
    testClipShoutout,
    updateClipShoutoutConfig,
    refreshClipShoutoutOverlayKey
} from "../api/clipShoutout.api";
import { deleteWidget } from "@/services/widget.service";
import { ClipShoutoutConfig } from "../types";

export const useClipShoutout = (initialConfig: ClipShoutoutConfig | null) => {
    const { user, isLoading: isUserLoading } = useUser();
    const [config, setConfig] = useState<ClipShoutoutConfig | null>(initialConfig);
    const [replyMessage, setReplyMessage] = useState(initialConfig?.reply_message || "");
    const [delayMs, setDelayMs] = useState(initialConfig?.delay_ms || 0);
    const [replyMessageError, setReplyMessageError] = useState<string | null>(null);
    const [isEnabled, setIsEnabled] = useState(initialConfig?.widget?.enabled ?? false);
    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [botProfile, setBotProfile] = useState<string>(initialConfig?.twitch_bot_id || user?.twitchId || "");
    const [enabledClip, setEnabledClip] = useState(initialConfig?.enabled_clip ?? true);
    const [enabledHighlightOnly, setEnabledHighlightOnly] = useState(initialConfig?.enabled_highlight_only ?? false);
    const [activeTab, setActiveTab] = useState(initialConfig ? "settings" : "overview");

    const replyMessageSchema = z.string().max(500, "ข้อความต้องไม่เกิน 500 ตัวอักษร");

    const overlayUrl = typeof window !== 'undefined' && user
        ? `${window.location.origin}/overlays/clip-shoutout/${user.id}${config?.widget && config.widget.overlay_key ? `?key=${config.widget.overlay_key}` : ''}`
        : "";

    useEffect(() => {
        if (!initialConfig && user?.twitchId) {
            setBotProfile(user.twitchId);
        }
    }, [user?.twitchId, initialConfig]);

    const handleEnable = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const data = await enableClipShoutout(user.twitchId, user.id);
            if (data) {
                tbToast.success({ title: "เปิดใช้งานสำเร็จ" });
                setConfig(data);
                setReplyMessage(data.reply_message || "");
                setDelayMs(data.delay_ms || 0);
                setIsEnabled(data.widget?.enabled ?? false);
                setEnabledClip(data.enabled_clip ?? false);
                setEnabledHighlightOnly(data.enabled_highlight_only ?? false);
                setActiveTab("quick-start");
            }
        } catch (error) {
            console.error("Failed to enable", error);
            tbToast.error({ title: "เปิดใช้งานไม่สำเร็จ" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = async () => {
        if (!config) return;

        const result = replyMessageSchema.safeParse(replyMessage);
        if (!result.success) {
            setReplyMessageError(result.error.issues[0].message);
            return;
        }

        setIsSaving(true);
        try {
            const updated = await updateClipShoutoutConfig({
                reply_message: replyMessage,
                delay_ms: delayMs,
                twitch_bot_id: botProfile === "default" ? null : botProfile,
                enabled_clip: enabledClip,
                enabled_highlight_only: enabledHighlightOnly
            });

            if (updated) {
                tbToast.success({ title: "บันทึกการตั้งค่าสำเร็จ" });
                setConfig(updated);
            }
        } catch (error) {
            console.error("Failed to update", error);
            tbToast.error({ title: "ไม่สามารถบันทึกการตั้งค่าได้" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleTest = async () => {
        if (!user || isTesting) return;

        setIsTesting(true);
        try {
            const mockEvent = {
                subscription: { status: "enabled", type: "channel.chat.notification" },
                event: {
                    broadcaster_user_id: user.twitchId,
                    broadcaster_user_login: user.username,
                    broadcaster_user_name: user.displayName,
                    chatter_user_id: "0",
                    chatter_user_login: "testuser",
                    chatter_user_name: "TestUser",
                    message: { text: "Test Shoutout", fragments: [] },
                    color: "#FF0000",
                    badges: [],
                    system_message: "TestUser raided you with 100 viewers!",
                    notice_type: "raid",
                    raid: {
                        user_id: user.twitchId,
                        user_login: "testuser",
                        user_name: `TestUser_${Math.random().toString().slice(2, 8)}`,
                        viewer_count: 100,
                        profile_image_url: ""
                    }
                }
            };

            await testClipShoutout(mockEvent);
            tbToast.success({ title: "ทดสอบวิดเจ็ตสำเร็จ" });
        } catch (error) {
            console.error("Test failed:", error);
            tbToast.error({ title: "ทดสอบวิดเจ็ตไม่สำเร็จ" });
        } finally {
            setIsTesting(false);
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
                setReplyMessage("");
                setIsEnabled(false);
                setActiveTab("overview");
            }
        } catch (error) {
            console.error("Failed to delete", error);
            tbToast.error({ title: "ไม่สามารถลบวิดเจ็ตได้" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleReplyMessageChange = (value: string) => {
        setReplyMessage(value);
        const result = replyMessageSchema.safeParse(value);
        if (result.success) {
            setReplyMessageError(null);
        }
    };

    const handleStatusChange = (checked: boolean) => {
        setIsEnabled(checked);
        setConfig(prev => prev ? {
            ...prev,
            widget: { ...prev.widget, enabled: checked }
        } : null);
    };

    return {
        user,
        config,
        replyMessage,
        delayMs,
        replyMessageError,
        isEnabled,
        isSaving,
        isTesting,
        isUserLoading,
        activeTab,
        botProfile,
        enabledClip,
        enabledHighlightOnly,
        overlayUrl,
        setConfig,
        setBotProfile,
        setEnabledClip,
        setDelayMs,
        setEnabledHighlightOnly,
        setActiveTab,
        handleEnable,
        handleSave,
        handleTest,
        handleDelete,
        handleReplyMessageChange,
        handleStatusChange
    };
};
