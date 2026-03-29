import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Info } from 'lucide-react'
import React from 'react'
import { WidgetStatusSwitch } from '@/components/widget/WidgetStatusSwitch'

interface WidgetSettingsCardProps {
    children: React.ReactNode
    widgetId?: string
    isEnabled?: boolean
    onStatusChange?: (checked: boolean) => void
}

const WidgetSettingsCard = ({ children, widgetId, isEnabled = false, onStatusChange }: WidgetSettingsCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                    <span className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-500" />
                        Settings
                    </span>
                    {widgetId && (
                        <WidgetStatusSwitch
                            widgetId={widgetId}
                            isEnabled={isEnabled}
                            onStatusChange={onStatusChange}
                        />
                    )}
                </CardTitle>
                <CardDescription>
                    ปรับแต่งการตั้งค่าสำหรับวิดเจ็ต
                </CardDescription>
            </CardHeader>
            {children}
        </Card>
    )
}

export default WidgetSettingsCard