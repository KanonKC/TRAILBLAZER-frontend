import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Info } from 'lucide-react'
import React, { useState } from 'react'
import { updateWidgetEnabled, getFirstEnabledWidget } from '@/services/widget.service'
import { tbToast } from '@/utils/tbToast'
import { WidgetQuotaDialog } from '@/components/widget/WidgetQuotaDialog'

interface WidgetSettingsCardProps {
    children: React.ReactNode
    widgetId?: string
    isEnabled?: boolean
    onStatusChange?: (checked: boolean) => void
}

const WidgetSettingsCard = ({ children, widgetId, isEnabled = false, onStatusChange }: WidgetSettingsCardProps) => {
    const [isUpdating, setIsUpdating] = useState(false)
    const [showLimitDialog, setShowLimitDialog] = useState(false)
    const [enabledWidgetName, setEnabledWidgetName] = useState<string | null>(null)

    const handleSwitchChange = async (checked: boolean, forceUpdate = false) => {
        if (!widgetId) return

        onStatusChange?.(checked)
        setIsUpdating(true)

        try {
            console.log("updateWidgetEnabled", widgetId, checked, { forceUpdate })
            const success = await updateWidgetEnabled(widgetId, checked, { forceUpdate })

            if (success) {
                tbToast.success({ title: "อัปเดตสถานะสำเร็จ" })
                setShowLimitDialog(false)
            } else {
                onStatusChange?.(!checked)
                tbToast.error({ title: "อัปเดตสถานะไม่สำเร็จ" })
            }
        } catch (error: any) {
            console.error("Failed to update status", error)

            if (error.response?.status === 402) {
                try {
                    const firstWidget = await getFirstEnabledWidget()
                    if (firstWidget && firstWidget.widget_type) {
                        console.log(firstWidget)
                        setEnabledWidgetName(firstWidget.widget_type.displayName)
                    }
                } catch (e) {
                    console.error("Failed to fetch first enabled widget", e)
                }
                setShowLimitDialog(true)
            } else {
                tbToast.error({ title: "ไม่สามารถอัปเดตสถานะได้" })
            }
            onStatusChange?.(!checked)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                    <span className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-500" />
                        Settings
                    </span>
                    {widgetId && (
                        <Switch
                            checked={isEnabled}
                            onCheckedChange={handleSwitchChange}
                            disabled={isUpdating}
                        />
                    )}
                </CardTitle>
                <CardDescription>
                    ปรับแต่งการตั้งค่าสำหรับวิดเจ็ต
                </CardDescription>
            </CardHeader>
            {children}

            <WidgetQuotaDialog
                open={showLimitDialog}
                onOpenChange={setShowLimitDialog}
                enabledWidgetName={enabledWidgetName}
                onConfirmToggle={() => handleSwitchChange(true, true)}
            />
        </Card>
    )
}

export default WidgetSettingsCard