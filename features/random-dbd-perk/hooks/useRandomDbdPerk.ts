import { useState, useEffect } from "react";
import { useUser } from "@/components/user-context";
import { tbToast } from "@/utils/tbToast";
import { 
    enableRandomDbdPerk, 
    updateRandomDbdPerkConfig, 
    testRandomDbdPerk 
} from "../api/randomDbdPerk.api";
import { deleteWidget } from "@/services/widget.service";
import { getTwitchChannelRewards, type TwitchCustomReward } from "@/services/twitch.service";
import { RandomDbdPerkConfig, RandomDbdPerkClass } from "../types";

export const PERKS_PER_PAGE = 15;

export const useRandomDbdPerk = (initialConfig: RandomDbdPerkConfig | null) => {
    const { user, isLoading: isUserLoading } = useUser();
    const [config, setConfig] = useState<RandomDbdPerkConfig | null>(initialConfig);
    const [isEnabled, setIsEnabled] = useState(initialConfig?.widget?.enabled ?? false);
    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [activeTab, setActiveTab] = useState(initialConfig ? "settings" : "overview");
    const [perkClasses, setPerkClasses] = useState<RandomDbdPerkClass[]>(initialConfig?.classes || []);
    const [survivorUnit, setSurvivorUnit] = useState<"perk" | "page">("perk");
    const [killerUnit, setKillerUnit] = useState<"perk" | "page">("perk");
    const [wizardType, setWizardType] = useState<"survivor" | "killer">("survivor");

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const savedSurvivorUnit = localStorage.getItem("random-dbd-perk-unit-preference-survivor");
        if (savedSurvivorUnit === "perk" || savedSurvivorUnit === "page") setSurvivorUnit(savedSurvivorUnit);
        const savedKillerUnit = localStorage.getItem("random-dbd-perk-unit-preference-killer");
        if (savedKillerUnit === "perk" || savedKillerUnit === "page") setKillerUnit(savedKillerUnit);
    }, []);

    const handleEnable = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const data = await enableRandomDbdPerk(true);
            if (data) {
                tbToast.success({ title: "เปิดใช้งานสำเร็จ" });
                setConfig(data);
                setIsEnabled(data.widget?.enabled ?? false);
                setPerkClasses(data.classes || []);
                setActiveTab("quick-start");
            }
        } catch (error) {
            console.error("Failed to enable", error);
            tbToast.error({ title: "เปิดใช้งานไม่สำเร็จ" });
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
                setPerkClasses([]);
                setActiveTab("overview");
            }
        } catch (error) {
            console.error("Failed to delete", error);
            tbToast.error({ title: "ไม่สามารถลบวิดเจ็ตได้" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = async () => {
        if (!config) return;
        setIsSaving(true);
        try {
            const updated = await updateRandomDbdPerkConfig({ classes: perkClasses });
            if (updated) {
                tbToast.success({ title: "บันทึกการตั้งค่าสำเร็จ" });
                setConfig(updated);
                setPerkClasses(updated.classes);
            }
        } catch (error) {
            console.error("Failed to save", error);
            tbToast.error({ title: "ไม่สามารถบันทึกการตั้งค่าได้" });
        } finally {
            setIsSaving(false);
        }
    };

    const updatePerkClass = (index: number, field: keyof RandomDbdPerkClass, value: any) => {
        const newClasses = [...perkClasses];
        newClasses[index] = { ...newClasses[index], [field]: value };
        if (field !== 'enabled') newClasses[index].enabled = true;
        setPerkClasses(newClasses);
    };

    const handleTest = async (type: 'survivor' | 'killer') => {
        if (!user || isTesting) return;
        const targetClass = perkClasses.find(c => c.type === type && c.enabled);
        let rewardId = targetClass?.twitch_reward_id || perkClasses.find(c => c.type === type && c.twitch_reward_id)?.twitch_reward_id || `test-reward-id-${type}`;

        setIsTesting(true);
        try {
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
                    reward: { id: rewardId, title: `Test ${type} Perk`, cost: 1, prompt: "" },
                    redeemed_at: new Date().toISOString()
                }
            };
            await testRandomDbdPerk(mockEvent);
            tbToast.success({ title: "ทดสอบวิดเจ็ตสำเร็จ" });
        } catch (error) {
            console.error("Test failed", error);
            tbToast.error({ title: "ทดสอบวิดเจ็ตไม่สำเร็จ" });
        } finally {
            setIsTesting(false);
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
        isTesting,
        isUserLoading,
        activeTab,
        perkClasses,
        survivorUnit,
        killerUnit,
        wizardType,
        setWizardType,
        setSurvivorUnit,
        setKillerUnit,
        setActiveTab,
        handleEnable,
        handleDelete,
        handleSave,
        handleTest,
        handleStatusChange,
        updatePerkClass
    };
};
