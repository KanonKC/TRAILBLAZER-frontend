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
                    className="w-full text-md h-12 trailblazer-gradient hover:brightness-110 text-primary-foreground font-semibold shadow-md"
                >
                    อัปเกรด
                </Button>
                <PricingTwitchDialog
                    open={showTwitchDialog}
                    onOpenChange={setShowTwitchDialog}
                />
            </>
        )
    }

    return null
}

export default SelectPlanButton