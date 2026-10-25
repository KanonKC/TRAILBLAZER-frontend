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
    /** Accessible name; set it when one page shows several switches. */
    ariaLabel?: string;
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
    disabled,
    ariaLabel = "สถานะวิดเจ็ต"
}: WidgetStatusSwitchProps) => {
    const {
        isUpdating,
        showLimitDialog,
        setShowLimitDialog,
        enabledWidgets,
        handleStatusChange,
        handleDisableWidget,
    } = useWidgetStatus(onSuccess);

    const onToggle = (checked: boolean) => {
        handleStatusChange(widgetId, checked, { onStatusChange });
    };

    return (
        <>
            <Switch
                checked={isEnabled}
                aria-label={ariaLabel}
                onCheckedChange={onToggle}
                disabled={disabled || !!isUpdating}
            />
            <WidgetQuotaDialog
                open={showLimitDialog}
                onOpenChange={setShowLimitDialog}
                enabledWidgets={enabledWidgets}
                onDisableWidget={handleDisableWidget}
            />
        </>
    );
};
