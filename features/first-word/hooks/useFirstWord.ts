"use client"

import { useState, useCallback, useEffect } from "react";
import { useUser } from "@/components/user-context";
import { tbToast } from "@/utils/tbToast";
import { z } from "zod";
import * as api from "../api/firstWord.api";
import { FirstWordConfig } from "../types";
import { UploadedFile, uploadFile } from "@/services/uploadedFile.service";
import { deleteWidget } from "@/services/widget.service";

/**
 * Controller Hook for FirstWord feature.
 * Encapsulates state management and business logic.
 */
export const useFirstWord = (initialConfig: FirstWordConfig | null, initialRequiresProPlan: boolean) => {
    const { user, isLoading: isUserLoading } = useUser();
    
    // Core State
    const [config, setConfig] = useState<FirstWordConfig | null>(initialConfig);
    const [requiresProPlan, setRequiresProPlan] = useState(initialRequiresProPlan);
    const [isEnabled, setIsEnabled] = useState(initialConfig?.widget?.enabled ?? false);
    const [activeTab, setActiveTab] = useState(initialConfig ? "settings" : "overview");
    
    // Form State
    const [replyMessage, setReplyMessage] = useState(initialConfig?.reply_message || "");
    const [replyMessageError, setReplyMessageError] = useState<string | null>(null);
    const [audioFile, setAudioFile] = useState<File | UploadedFile | null>(initialConfig?.audio || null);
    const [audioVolume, setAudioVolume] = useState<number>(initialConfig?.audio_volume ?? 100);
    const [botProfile, setBotProfile] = useState<string>(initialConfig?.twitch_bot_id || user?.twitchId || "default");
    
    // Operation State
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [isResettingChatters, setIsResettingChatters] = useState(false);
    const [chattersCount, setChattersCount] = useState<number>(0);
    
    // UI Feedback State
    const [showConfirmReset, setShowConfirmReset] = useState(false);

    const replyMessageSchema = z.string().max(500, "ข้อความต้องไม่เกิน 500 ตัวอักษร");

    // Derived State
    const overlayUrl = typeof window !== 'undefined' && user
        ? `${window.location.origin}/overlays/first-word/${user.id}${config?.widget && config.widget.overlay_key ? `?key=${config.widget.overlay_key}` : ''}`
        : "";

    // Sync audioFile when config changes
    useEffect(() => {
        if (config) {
            setAudioFile(config.audio || null);
        }
    }, [config]);

    // Handlers
    const fetchConfig = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.getFirstWordConfig();
            if (data) {
                setConfig(data);
                setReplyMessage(data.reply_message || "");
                setIsEnabled(data.widget?.enabled ?? false);
                setAudioVolume(data.audio_volume ?? 100);
                setBotProfile(data.twitch_bot_id || "default");
                setActiveTab("settings");
                setRequiresProPlan(false);
            } else {
                setConfig(null);
            }
        } catch (error: any) {
            if (error.response?.status === 403) {
                setRequiresProPlan(true);
                setConfig(null);
            }
            console.error("Failed to fetch config", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleEnable = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const data = await api.enableFirstWord(user.twitchId, user.id);
            if (data) {
                tbToast.success({ title: "เปิดใช้งานสำเร็จ" });
                setConfig(data);
                setReplyMessage(data.reply_message || "");
                setIsEnabled(data.widget?.enabled ?? false);
                setActiveTab("quick-start");
            }
        } catch (error) {
            console.error("Failed to enable", error);
            tbToast.error({ title: "เปิดใช้งานไม่สำเร็จ", error: (error as any).response?.data });
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
            let audio_key: string | null = null;
            if (audioFile instanceof File) {
                const uploaded = await uploadFile(audioFile);
                audio_key = uploaded.key;
            } else if (audioFile) {
                audio_key = audioFile.key;
            }

            const payload: Partial<FirstWordConfig> = {
                reply_message: replyMessage,
                twitch_bot_id: botProfile === "default" ? null : botProfile,
                audio_volume: audioVolume,
                audio_key,
            };

            const updated = await api.updateFirstWordConfig(payload);
            if (updated) {
                setConfig(updated);
                setAudioFile(updated.audio);
                tbToast.success({
                    title: "บันทึกสำเร็จ",
                    description: "การตั้งค่าของคุณถูกบันทึกเรียบร้อยแล้ว",
                });
            }
        } catch (error) {
            tbToast.error({
                title: "บันทึกไม่สำเร็จ",
                description: "เกิดข้อผิดพลาดในการบันทึกการตั้งค่า",
                error: (error as any).response?.data
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleTestAudio = async () => {
        if (!user || isTesting) return;

        setIsTesting(true);
        const dummyUser = `TestUser_${Math.random().toString().substring(2, 8)}`;
        try {
            const mockEvent = {
                subscription: { status: "enabled" },
                event: {
                    broadcaster_user_id: user.twitchId,
                    broadcaster_user_login: user.username,
                    broadcaster_user_name: user.displayName,
                    chatter_user_id: "0",
                    chatter_user_login: dummyUser.toLowerCase(),
                    chatter_user_name: dummyUser,
                    message_id: crypto.randomUUID(),
                    message: { text: "Test Message", fragments: [{ type: "text", text: "Test Message", cheermote: null, emote: null, mention: null }] },
                    color: "#FF0000",
                    badges: [],
                    message_type: "text",
                    cheer: null,
                    reply: null,
                    channel_points_custom_reward_id: null,
                    source_broadcaster_user_id: null,
                    source_broadcaster_user_login: null,
                    source_broadcaster_user_name: null,
                    source_message_id: null,
                    source_badges: null
                }
            };
            await api.testFirstWordAudio(mockEvent);
            tbToast.success({ title: "ส่งคำสั่งทดสอบสำเร็จ", description: "ส่งอีเวนต์ทดสอบเสียงเรียบร้อยแล้ว" });
        } catch (error) {
            console.error("Test failed:", error);
            tbToast.error({ title: "ไม่สามารถทดสอบได้", description: "ล้มเหลวในการส่งอีเวนต์ทดสอบ", error: (error as any).response?.data });
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
                setAudioFile(null);
                setActiveTab("overview");
            }
        } catch (error) {
            console.error("Failed to delete", error);
            tbToast.error({ title: "ไม่สามารถลบวิดเจ็ตได้", error: (error as any).response?.data });
        } finally {
            setIsSaving(false);
        }
    };

    const handleResetClick = async () => {
        setIsResettingChatters(true);
        try {
            const data = await api.listChatters();
            setChattersCount(data?.pagination.total || 0);
            setShowConfirmReset(true);
        } catch (error) {
            console.error("Failed to fetch chatters", error);
            tbToast.error({ title: "ดึงข้อมูลรายชื่อทักทายไม่สำเร็จ", error: (error as any).response?.data });
        } finally {
            setIsResettingChatters(false);
        }
    };

    const handleConfirmReset = async () => {
        setIsResettingChatters(true);
        try {
            const success = await api.resetChatters();
            if (success) {
                tbToast.success({ title: "รีเซ็ตรายชื่อผู้ทักทายเรียบร้อยแล้ว" });
                setChattersCount(0);
            } else {
                tbToast.error({ title: "รีเซ็ตไม่สำเร็จ" });
            }
        } catch (error) {
            console.error("Failed to reset chatters", error);
            tbToast.error({ title: "รีเซ็ตไม่สำเร็จ", error: (error as any).response?.data });
        } finally {
            setIsResettingChatters(false);
            setShowConfirmReset(false);
        }
    };

    const handleReplyMessageChange = (value: string) => {
        setReplyMessage(value);
        if (replyMessageError) {
            const result = replyMessageSchema.safeParse(value);
            if (result.success) {
                setReplyMessageError(null);
            }
        }
    };

    const handleStatusChange = (checked: boolean) => {
        setIsEnabled(checked);
        setConfig(prev => prev ? {
            ...prev,
            widget: {
                ...prev.widget,
                enabled: checked
            }
        } : null);
    };


    return {
        // State
        config,
        user,
        isUserLoading,
        requiresProPlan,
        isEnabled,
        activeTab,
        replyMessage,
        replyMessageError,
        audioFile,
        audioVolume,
        botProfile,
        isLoading,
        isSaving,
        isTesting,
        isResettingChatters,
        chattersCount,
        showConfirmReset,
        overlayUrl,
        setConfig,
        
        // Actions
        setActiveTab,
        setReplyMessage,
        setAudioFile,
        setAudioVolume,
        setBotProfile,
        setShowConfirmReset,
        handleEnable,
        handleSave,
        handleTestAudio,
        handleDelete,
        handleResetClick,
        handleConfirmReset,
        handleReplyMessageChange,
        handleStatusChange
    };
};
