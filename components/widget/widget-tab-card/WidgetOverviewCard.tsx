import { TwitchLoginButton } from '@/components/button/TwitchLoginButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Info } from 'lucide-react'
import React from 'react'

interface WidgetOverviewCardProps {
    children?: React.ReactNode
    showLoginButton?: boolean
    showEnableButton?: boolean
    onClickEnable?: () => void
    isLoading?: boolean
}

const WidgetOverviewCard = ({ children, showLoginButton, showEnableButton, onClickEnable, isLoading }: WidgetOverviewCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    Overview
                </CardTitle>
                <CardDescription>
                    อธิบายความสามารถและการทำงานของวิดเจ็ตตัวนี้
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {children}
            </CardContent>
            <CardFooter>
                {showLoginButton && (
                    <TwitchLoginButton className="w-full" />
                )}
                {showEnableButton && (
                    <Button onClick={onClickEnable} disabled={isLoading} className="w-full">
                        {isLoading ? "กำลังเปิดใช้งาน..." : "เปิดใช้งาน Widget"}
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

export default WidgetOverviewCard