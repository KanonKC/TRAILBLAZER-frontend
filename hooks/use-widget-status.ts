import { useState } from 'react'
import { updateWidgetEnabled, listWidgets, ExtendedWidget } from '@/services/widget.service'
import { tbToast } from '@/utils/tbToast'

/**
 * Hook to manage widget status toggling logic across the application.
 * Handles API calls and 402 Quota errors.
 * On quota exceeded (402), fetches the list of all enabled widgets so the
 * dialog can show the user which ones to disable.
 */
export const useWidgetStatus = (onSuccess?: () => void) => {
    const [isUpdating, setIsUpdating] = useState<string | null>(null)
    const [showLimitDialog, setShowLimitDialog] = useState(false)
    const [enabledWidgets, setEnabledWidgets] = useState<ExtendedWidget[]>([])
    const [pendingWidgetId, setPendingWidgetId] = useState<string | null>(null)

    const handleStatusChange = async (
        widgetId: string,
        checked: boolean,
        options: {
            onStatusChange?: (checked: boolean) => void
        } = {}
    ) => {
        const { onStatusChange } = options

        setIsUpdating(widgetId)
        // Optionally trigger callback for optimistic updates in the parent
        onStatusChange?.(checked)

        try {
            const success = await updateWidgetEnabled(widgetId, checked)

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
                    const res = await listWidgets({ enabled: true })
                    setEnabledWidgets(res.data)
                } catch (e) {
                    console.error("Failed to fetch enabled widgets", e)
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

    const handleDisableWidget = async (widgetId: string) => {
        try {
            await updateWidgetEnabled(widgetId, false)
            setEnabledWidgets(prev => prev.filter(w => w.id !== widgetId))
            onSuccess?.()
        } catch (error) {
            console.error("Failed to disable widget", error)
            tbToast.error({ title: "ไม่สามารถปิดวิดเจ็ตได้" })
        }
    }

    return {
        isUpdating, // Returns widgetId if updating, null otherwise
        showLimitDialog,
        setShowLimitDialog,
        enabledWidgets,
        pendingWidgetId,
        handleStatusChange,
        handleDisableWidget,
    }
}
