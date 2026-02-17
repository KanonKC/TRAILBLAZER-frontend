import { CardContent } from '@/components/ui/card'
import React from 'react'

interface WidgetSettingsCardContentProps {
    children?: React.ReactNode
}

const WidgetSettingsCardContent = ({ children }: WidgetSettingsCardContentProps) => {
    return (
        <CardContent className="space-y-8">
            {children}
        </CardContent>
    )
}

export default WidgetSettingsCardContent