import { TwitchLoginButton } from '@/components/button/TwitchLoginButton'
import UpgradeToProPlanDialog from '@/components/dialog/UpgradeToProPlanDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Crown, Info } from 'lucide-react'
import React, { useState } from 'react'

interface WidgetOverviewCardProps {
    children?: React.ReactNode
    showLoginButton?: boolean
    showEnableButton?: boolean
    showUpgradeButton?: boolean
    onClickEnable?: () => void
    isLoading?: boolean
}

const WidgetOverviewCard = ({ children, showLoginButton, showEnableButton, showUpgradeButton, onClickEnable, isLoading }: WidgetOverviewCardProps) => {
    const [openUpgradeDialog, setOpenUpgradeDialog] = useState(false);
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
                {showUpgradeButton && (
                    <Button
                        onClick={() => setOpenUpgradeDialog(true)}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
                    >
                        <Crown className="w-4 h-4 mr-2" />
                        อัปเกรดเป็น Pro
                    </Button>
                )}
            </CardFooter>
            <UpgradeToProPlanDialog open={openUpgradeDialog} onOpenChange={setOpenUpgradeDialog} />
        </Card>
    )
}

export default WidgetOverviewCard