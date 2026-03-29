"use client";

import { Switch } from "@/components/ui/switch";
import { useWidgetStatus } from "@/hooks/use-widget-status";
import { WidgetQuotaDialog } from "./WidgetQuotaDialog";

interface WidgetStatusSwitchProps {
    widgetId: string;
    isEnabled: boolean;
    onStatusChange?: (checked: boolean) => void;
    onSuccess?: () => void;
    disabled?: boolean;
}

/**
 * A reusable switch component for toggling widget status.
 * Encapsulates the Switch UI, useWidgetStatus logic, and WidgetQuotaDialog.
 */
export const WidgetStatusSwitch = ({
    widgetId,
    isEnabled,
    onStatusChange,
    onSuccess,
    disabled
}: WidgetStatusSwitchProps) => {
    const {
        isUpdating,
        showLimitDialog,
        setShowLimitDialog,
        enabledWidgetName,
        pendingWidgetId,
        handleStatusChange
    } = useWidgetStatus(onSuccess);

    const onToggle = (checked: boolean) => {
        handleStatusChange(widgetId, checked, { onStatusChange });
    };

    const onConfirmToggle = () => {
        if (pendingWidgetId) {
            handleStatusChange(pendingWidgetId, true, { forceUpdate: true, onStatusChange });
        }
    };

    return (
        <>
            <Switch
                checked={isEnabled}
                onCheckedChange={onToggle}
                disabled={disabled || !!isUpdating}
            />
            <WidgetQuotaDialog
                open={showLimitDialog}
                onOpenChange={setShowLimitDialog}
                enabledWidgetName={enabledWidgetName}
                onConfirmToggle={onConfirmToggle}
            />
        </>
    );
};
