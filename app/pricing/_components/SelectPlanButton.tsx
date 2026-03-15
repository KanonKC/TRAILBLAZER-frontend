import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import React, { useState } from 'react'
import { PricingTwitchDialog } from './PricingTwitchDialog'

interface SelectPlanButtonProps {
    status: "current" | "upper" | "lower"
}

const SelectPlanButton = ({ status }: SelectPlanButtonProps) => {
    const [showTwitchDialog, setShowTwitchDialog] = useState(false)

    if (status === "current") {
        return (
            <Button variant="outline" className="w-full text-md h-12" disabled>
                แผนปัจจุบัน
            </Button>
        )
    }

    if (status === "lower") {
        return (
            <Button variant="outline" className="w-full text-md h-12" disabled>
                <Check />
            </Button>
        )
    }

    if (status === "upper") {
        return (
            <>
                <Button
                    onClick={() => setShowTwitchDialog(true)}
                    className="w-full text-md h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-md"
                >
                    อัปเกรดเป็น Pro บน Twitch
                </Button>
                <PricingTwitchDialog
                    open={showTwitchDialog}
                    onOpenChange={setShowTwitchDialog}
                />
            </>
        )
    }
}

export default SelectPlanButton