import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Play } from 'lucide-react'
import React from 'react'

interface WidgetQuickStartCardProps {
    children?: React.ReactNode
}

const WidgetQuickStartCard = ({ children }: WidgetQuickStartCardProps) => {
    return (
        <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                    <Play className="w-5 h-5 text-green-500" />
                    Quick Start
                </CardTitle>
                <CardDescription className="text-white/70">
                    เริ่มต้นใช้งานได้ในไม่กี่นาที
                </CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}

export default WidgetQuickStartCard