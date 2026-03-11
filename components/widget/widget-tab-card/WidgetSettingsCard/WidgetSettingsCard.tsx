import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Info } from 'lucide-react'
import React, { useState } from 'react'
import { updateWidgetEnabled } from '@/services/widget.service'
import { tbToast } from '@/utils/tbToast'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation'

interface WidgetSettingsCardProps {
    children: React.ReactNode
    widgetId?: string
    isEnabled?: boolean
    onStatusChange?: (checked: boolean) => void
}

const WidgetSettingsCard = ({ children, widgetId, isEnabled = false, onStatusChange }: WidgetSettingsCardProps) => {
    const [isUpdating, setIsUpdating] = useState(false)
    const [showLimitDialog, setShowLimitDialog] = useState(false)
    const router = useRouter()

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

            <AlertDialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ไม่สามารถเปิดใช้งานวิดเจ็ตได้</AlertDialogTitle>
                        <AlertDialogDescription>
                            เนื่องจากคุณเป็นผู้ใช้งาน Free Tier คุณสามารถเปิดใช้งานวิดเจ็ตได้เพียง 1 อันเท่านั้น หากคุณเปิดใช้งานวิดเจ็ตนี้ วิดเจ็ตอื่นๆ ที่เคยเปิดใช้งานไว้จะถูกปิดทั้งหมด
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => router.push('/pricing')}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            อัปเกรดเป็น Pro Plan
                        </AlertDialogAction>
                        <AlertDialogAction
                            onClick={() => handleSwitchChange(true, true)}
                        >
                            ปิดอันอื่นและเปิดอันนี้
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}

export default WidgetSettingsCard