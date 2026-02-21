import { CardFooter } from '@/components/ui/card'
import React from 'react'

interface WidgetSettingsCardFooterProps {
    children?: React.ReactNode
}

const WidgetSettingsCardFooter = ({ children }: WidgetSettingsCardFooterProps) => {
    return (
        <CardFooter className="flex justify-between border-t px-6 py-4">
            {children}
        </CardFooter>
    )
}

export default WidgetSettingsCardFooter