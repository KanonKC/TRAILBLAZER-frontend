import { useState } from 'react'
import { updateWidgetEnabled, getFirstEnabledWidget } from '@/services/widget.service'
import { tbToast } from '@/utils/tbToast'

/**
 * Hook to manage widget status toggling logic across the application.
 * Handles API calls, 402 Quota errors, and optimistic UI updates.
 */
export const useWidgetStatus = (onSuccess?: () => void) => {
    const [isUpdating, setIsUpdating] = useState<string | null>(null)
    const [showLimitDialog, setShowLimitDialog] = useState(false)
    const [enabledWidgetName, setEnabledWidgetName] = useState<string | null>(null)
    const [pendingWidgetId, setPendingWidgetId] = useState<string | null>(null)

    const handleStatusChange = async (
        widgetId: string, 
        checked: boolean, 
        options: { 
            forceUpdate?: boolean, 
            onStatusChange?: (checked: boolean) => void 
        } = {}
    ) => {
        const { forceUpdate = false, onStatusChange } = options
        
        setIsUpdating(widgetId)
        // Optionally trigger callback for optimistic updates in the parent
        onStatusChange?.(checked)

        try {
            const success = await updateWidgetEnabled(widgetId, checked, { forceUpdate })

            if (success) {
                tbToast.success({ title: "อัปเดตสถานะสำเร็จ" })
                setShowLimitDialog(false)
                onSuccess?.()
            } else {
                // Revert status on failure
                onStatusChange?.(!checked)
                tbToast.error({ title: "อัปเดตสถานะไม่สำเร็จ" })
            }
        } catch (error: any) {
            console.error("Failed to update status", error)

            if (error.response?.status === 402) {
                try {
                    const firstWidget = await getFirstEnabledWidget()
                    if (firstWidget && firstWidget.widget_type) {
                        setEnabledWidgetName(firstWidget.widget_type.displayName)
                    }
                } catch (e) {
                    console.error("Failed to fetch first enabled widget", e)
                }
                setPendingWidgetId(widgetId)
                setShowLimitDialog(true)
            } else {
                tbToast.error({ title: "ไม่สามารถอัปเดตสถานะได้" })
            }
            // Revert status on error
            onStatusChange?.(!checked)
        } finally {
            setIsUpdating(null)
        }
    }

    return {
        isUpdating, // Returns widgetId if updating, null otherwise
        showLimitDialog,
        setShowLimitDialog,
        enabledWidgetName,
        pendingWidgetId,
        handleStatusChange
    }
}
