import { TwitchLoginButton } from '@/components/button/TwitchLoginButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Info } from 'lucide-react'
import React from 'react'

interface WidgetSettingsCardProps {
    children: React.ReactNode
    isEnabled?: boolean
    handleSwitchChange?: (checked: boolean) => void
}

const WidgetSettingsCard = ({ children, isEnabled = false, handleSwitchChange }: WidgetSettingsCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                    <span className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-500" />
                        Settings
                    </span>
                    {handleSwitchChange && (
                        <Switch
                            checked={isEnabled}
                            onCheckedChange={handleSwitchChange}
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