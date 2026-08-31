import { useState } from "react";
import { useUser } from "@/components/user-context";
import { tbToast } from "@/utils/tbToast";
import { enableEndCredit, updateEndCreditConfig, testEndCredit } from "../api/endCredit.api";
import { deleteWidget } from "@/services/widget.service";
import { EndCreditConfig } from "../types";

export const useEndCredit = (initialConfig: EndCreditConfig | null) => {
    const { user, isLoading: isUserLoading } = useUser();
    const [config, setConfig] = useState<EndCreditConfig | null>(initialConfig);
    const [followersHeader, setFollowersHeader] = useState(initialConfig?.followers_header || "ผู้ติดตามใหม่");
    const [subscribesHeader, setSubscribesHeader] = useState(initialConfig?.subscribes_header || "สมาชิกใหม่");
    const [raidsHeader, setRaidsHeader] = useState(initialConfig?.raids_header || "ผู้ที่ Raid เข้ามา");
    const [bitsHeader, setBitsHeader] = useState(initialConfig?.bits_header || "ผู้สนับสนุน Bits");
    const [viewersHeader, setViewersHeader] = useState(initialConfig?.viewers_header || "ผู้ชมในสตรีมนี้");
    const [isShowViewerAvatars, setIsShowViewerAvatars] = useState(initialConfig?.is_show_viewer_avatars ?? true);
    const [scrollSpeed, setScrollSpeed] = useState(initialConfig?.scroll_speed || 60);
    const [isShowSubMonths, setIsShowSubMonths] = useState(initialConfig?.is_show_sub_months ?? false);
    const [isShowRaidCount, setIsShowRaidCount] = useState(initialConfig?.is_show_raid_count ?? false);
    const [isShowBitsAmount, setIsShowBitsAmount] = useState(initialConfig?.is_show_bits_amount ?? false);
    const [isEnabled, setIsEnabled] = useState(initialConfig?.widget?.enabled ?? false);
    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [activeTab, setActiveTab] = useState(initialConfig ? "settings" : "overview");

    const overlayUrl = typeof window !== 'undefined' && user
        ? `${window.location.origin}/overlays/end-credit/${user.id}${config?.widget && config.widget.overlay_key ? `?key=${config.widget.overlay_key}` : ''}`
        : "";

    const handleEnable = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const data = await enableEndCredit(user.twitchId, user.id);
            if (data) {
                tbToast.success({ title: "เปิดใช้งานสำเร็จ" });
                setConfig(data);
                setFollowersHeader(data.followers_header || "ผู้ติดตามใหม่");
                setSubscribesHeader(data.subscribes_header || "สมาชิกใหม่");
                setRaidsHeader(data.raids_header || "ผู้ที่ Raid เข้ามา");
                setBitsHeader(data.bits_header || "ผู้สนับสนุน Bits");
                setViewersHeader(data.viewers_header || "ผู้ชมในสตรีมนี้");
                setIsShowViewerAvatars(data.is_show_viewer_avatars ?? true);
                setScrollSpeed(data.scroll_speed || 60);
                setIsShowSubMonths(data.is_show_sub_months ?? false);
                setIsShowRaidCount(data.is_show_raid_count ?? false);
                setIsShowBitsAmount(data.is_show_bits_amount ?? false);
                setIsEnabled(data.widget?.enabled ?? false);
                setActiveTab("settings");
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
        setIsSaving(true);
        try {
            const updated = await updateEndCreditConfig({
                followers_header: followersHeader,
                subscribes_header: subscribesHeader,
                raids_header: raidsHeader,
                bits_header: bitsHeader,
                viewers_header: viewersHeader,
                is_show_viewer_avatars: isShowViewerAvatars,
                scroll_speed: scrollSpeed,
                is_show_sub_months: isShowSubMonths,
                is_show_raid_count: isShowRaidCount,
                is_show_bits_amount: isShowBitsAmount,
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
            await testEndCredit();
            tbToast.success({ title: "ทดสอบวิดเจ็ตสำเร็จ", description: "Credit Roll จะเล่นบน Overlay ที่เปิดอยู่" });
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
        followersHeader,
        subscribesHeader,
        raidsHeader,
        bitsHeader,
        viewersHeader,
        isShowViewerAvatars,
        scrollSpeed,
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
        setViewersHeader,
        setIsShowViewerAvatars,
        setScrollSpeed,
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
    };
};
