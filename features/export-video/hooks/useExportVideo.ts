"use client"

import { useState, useCallback, useEffect } from "react";
import { useUser } from "@/components/user-context";
import { tbToast } from "@/utils/tbToast";
import { z } from "zod";
import * as api from "../api/exportVideo.api";
import { ExportVideoConfig, ExportVideoHistory } from "../types";
import { deleteWidget } from "@/services/widget.service";

const exportVideoSchema = z.object({
    privacy_status: z.enum(["PRIVATE", "PUBLIC", "UNLISTED"]),
    tags: z.array(z.string().max(100, "Tag must be under 100 chars")).max(30, "Max 30 tags"),
    description: z.string().max(5000, "Description must be under 5000 chars").nullable(),
});

/**
 * Controller Hook for ExportVideo feature.
 */
export const useExportVideo = (initialConfig: ExportVideoConfig | null, initialRequiresProPlan: boolean) => {
    const { user, isLoading: isUserLoading } = useUser();

    // Core State
    const [config, setConfig] = useState<ExportVideoConfig | null>(initialConfig);
    const [requiresProPlan, setRequiresProPlan] = useState(initialRequiresProPlan);
    const [isEnabled, setIsEnabled] = useState(initialConfig?.widget?.enabled ?? false);
    const [activeTab, setActiveTab] = useState(initialConfig ? "settings" : "overview");

    // History State
    const [history, setHistory] = useState<ExportVideoHistory[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [historyPage, setHistoryPage] = useState(1);
    const [historyLimit, setHistoryLimit] = useState(10);
    const [historyTotal, setHistoryTotal] = useState(0);

    // Form State
    const [privacyStatus, setPrivacyStatus] = useState(initialConfig?.privacy_status || "UNLISTED");
    const [tags, setTags] = useState<string[]>(initialConfig?.tags || []);
    const [tagsInput, setTagsInput] = useState("");
    const [description, setDescription] = useState(initialConfig?.description || "");

    // Operation State
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);

    // Handlers
    const fetchHistory = useCallback(async (page = 1, limit = 10) => {
        if (!config) return;
        setIsLoadingHistory(true);
        try {
            const data = await api.listExportVideoHistory(page, limit);
            setHistory(data.data);
            setHistoryTotal(data.pagination.total);
            setHistoryPage(data.pagination.page);
            setHistoryLimit(data.pagination.limit);
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setIsLoadingHistory(false);
        }
    }, [config]);

    const handleEnable = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const data = await api.enableExportVideo(user.twitchId, user.id);
            if (data) {
                tbToast.success({ title: "เปิดใช้งานสำเร็จ" });
                setConfig(data);
                setIsEnabled(data.widget?.enabled ?? false);
                setPrivacyStatus(data.privacy_status);
                setTags(data.tags || []);
                setDescription(data.description || "");
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

        const validation = exportVideoSchema.safeParse({
            privacy_status: privacyStatus,
            tags,
            description: description || null,
        });

        if (!validation.success) {
            tbToast.error({ title: "ข้อมูลไม่ถูกต้อง", description: validation.error.issues[0].message });
            return;
        }

        setIsSaving(true);
        try {
            const updated = await api.updateExportVideoConfig({
                enabled: isEnabled,
                privacy_status: privacyStatus,
                tags,
                description: description || null,
            });
            if (updated) {
                setConfig(updated);
                setTags(updated.tags || []);
                setDescription(updated.description || "");
                tbToast.success({ title: "บันทึกสำเร็จ" });
            }
        } catch (error) {
            console.error("Failed to save", error);
            tbToast.error({ title: "บันทึกไม่สำเร็จ", error: (error as any).response?.data });
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
                setActiveTab("overview");
            }
        } catch (error) {
            console.error("Failed to delete", error);
            tbToast.error({ title: "ไม่สามารถลบวิดเจ็ตได้", error: (error as any).response?.data });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteHistory = async (id: number) => {
        try {
            const success = await api.deleteExportVideoHistory(id);
            if (success) {
                setHistory(prev => prev.filter(h => h.id !== id));
                tbToast.success({ title: "ลบประวัติสำเร็จ" });
            }
        } catch (error) {
            console.error("Failed to delete history", error);
            tbToast.error({ title: "ลบประวัติไม่สำเร็จ" });
        }
    };

    const handleAddTag = () => {
        for (const tag of tagsInput.split(",")) {
            const trimmed = tag.trim();
            if (trimmed && !tags.includes(trimmed)) {
                if (tags.length >= 30) {
                    tbToast.error({ title: "จำกัดแท็กสูงสุด 30 รายการ" });
                    return;
                }
                setTags(prev => [...prev, trimmed]);
                setTagsInput("");
            }
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags(prev => prev.filter(t => t !== tag));
    };
 
    const handleTestExport = async () => {
        setIsTesting(true);
        try {
            await api.testExportVideo();
            tbToast.success({ 
                title: "ส่งคำขอทดสอบสำเร็จ", 
                description: "โปรดรอสักครู่ ระบบกำลังเริ่มส่งออกวิดีโอล่าสุดของคุณไปยัง YouTube" 
            });
            // Refresh history after a short delay
            setTimeout(() => fetchHistory(1), 3000);
        } catch (error) {
            console.error("Failed to test export", error);
            tbToast.error({ 
                title: "ส่งคำขอทดสอบไม่สำเร็จ", 
                description: (error as any).response?.data?.message || "ไม่พบวิดีโอล่าสุดบน Twitch สำหรับการส่งออก" 
            });
        } finally {
            setIsTesting(false);
        }
    };

    const handleStatusChange = (checked: boolean) => {
        setIsEnabled(checked);
    };

    return {
        // State
        config,
        history,
        isLoadingHistory,
        historyPage,
        historyLimit,
        historyTotal,
        user,
        isUserLoading,
        requiresProPlan,
        isEnabled,
        activeTab,
        privacyStatus,
        tags,
        tagsInput,
        description,
        isLoading,
        isSaving,
        isTesting,

        // Actions
        setActiveTab,
        setPrivacyStatus,
        setTagsInput,
        setDescription,
        handleEnable,
        handleSave,
        handleDelete,
        fetchHistory,
        handleDeleteHistory,
        handleAddTag,
        handleRemoveTag,
        handleTestExport,
        handleStatusChange,
        setHistoryPage,
        setHistoryLimit,
    };
};
