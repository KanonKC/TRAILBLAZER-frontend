import { useState, useEffect } from "react";
import { useUser } from "@/components/user-context";
import { useWidgetLifecycleState } from "@/hooks/use-widget-lifecycle-state";
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
    const { config, setConfig, isEnabled, setIsEnabled, isSaving, setIsSaving, isTesting, setIsTesting, activeTab, setActiveTab, handleStatusChange, runSaving, runTesting } = useWidgetLifecycleState(initialConfig);
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
        await runSaving(async () => {
            const data = await enableRandomDbdPerk(true);
            if (data) {
                tbToast.success({ title: "เปิดใช้งานสำเร็จ" });
                setConfig(data);
                setIsEnabled(data.widget?.enabled ?? false);
                setPerkClasses(data.classes || []);
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
                setPerkClasses([]);
                setActiveTab("overview");
            }
        }, "ลบวิดเจ็ตไม่สำเร็จ", "Failed to delete");
    };

    const handleSave = async () => {
        if (!config) return;
        await runSaving(async () => {
            const updated = await updateRandomDbdPerkConfig({ classes: perkClasses });
            if (updated) {
                tbToast.success({ title: "บันทึกการตั้งค่าสำเร็จ" });
                setConfig(updated);
                setPerkClasses(updated.classes);
            }
        }, "บันทึกการตั้งค่าไม่สำเร็จ", "Failed to save");
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
                    reward: { id: rewardId, title: `Test ${type} Perk`, cost: 1, prompt: "" },
                    redeemed_at: new Date().toISOString()
                }
            };
            await testRandomDbdPerk(mockEvent);
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
