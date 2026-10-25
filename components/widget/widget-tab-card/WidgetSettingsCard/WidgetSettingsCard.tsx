import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Zap } from 'lucide-react'
import React from 'react'
import { WidgetStatusSwitch } from '@/components/widget/WidgetStatusSwitch'

interface WidgetSettingsCardProps {
    children: React.ReactNode
    widgetId?: string
    isEnabled?: boolean
    cost?: number
    onStatusChange?: (checked: boolean) => void
    onSuccess?: () => void
}

const WidgetSettingsCard = ({ children, widgetId, isEnabled = false, cost, onStatusChange, onSuccess }: WidgetSettingsCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                    <span className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-violet" />
                        ตั้งค่า
                    </span>
                    <div className="flex items-center gap-3">
                        {cost !== undefined && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-supernova/10 px-2 py-0.5 text-sm font-medium text-supernova">
                                <Zap className="h-3 w-3" />
                                {cost} พอยท์
                            </span>
                        )}
                        {widgetId && (
                            <WidgetStatusSwitch
                                widgetId={widgetId}
                                isEnabled={isEnabled}
                                onStatusChange={onStatusChange}
                                onSuccess={onSuccess}
                            />
                        )}
                    </div>
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