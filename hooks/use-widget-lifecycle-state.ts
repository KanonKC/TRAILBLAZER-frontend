"use client";

import { useState } from "react";
import { tbToast } from "@/utils/tbToast";

interface WidgetConfigState {
    widget: { enabled: boolean };
}

/** State shared by widget setup controllers; feature fields stay in their own hook. */
export function useWidgetLifecycleState<Config extends WidgetConfigState>(initialConfig: Config | null) {
    const [config, setConfig] = useState<Config | null>(initialConfig);
    const [isEnabled, setIsEnabled] = useState(initialConfig?.widget?.enabled ?? false);
    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [activeTab, setActiveTab] = useState(initialConfig ? "settings" : "overview");

    const handleStatusChange = (checked: boolean) => {
        setIsEnabled(checked);
        setConfig(previous => previous ? {
            ...previous,
            widget: { ...previous.widget, enabled: checked },
        } : null);
    };

    const runOperation = async (
        operation: () => Promise<void>,
        setBusy: (busy: boolean) => void,
        failureTitle: string,
        logMessage: string,
    ) => {
        setBusy(true);
        try {
            await operation();
        } catch (error) {
            console.error(logMessage, error);
            tbToast.error({ title: failureTitle, error: (error as { response?: { data?: unknown } }).response?.data });
        } finally {
            setBusy(false);
        }
    };

    const runSaving = (operation: () => Promise<void>, failureTitle: string, logMessage: string) =>
        runOperation(operation, setIsSaving, failureTitle, logMessage);
    const runTesting = (operation: () => Promise<void>, failureTitle: string, logMessage: string) =>
        runOperation(operation, setIsTesting, failureTitle, logMessage);

    return {
        config, setConfig,
        isEnabled, setIsEnabled,
        isSaving, setIsSaving,
        isTesting, setIsTesting,
        activeTab, setActiveTab,
        handleStatusChange,
        runSaving, runTesting,
    };
}
