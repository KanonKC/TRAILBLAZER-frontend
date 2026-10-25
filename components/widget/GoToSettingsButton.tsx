import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface GoToSettingsButtonProps {
    onClick: () => void
}

const GoToSettingsButton = ({ onClick }: GoToSettingsButtonProps) => {
    return (
        <Button variant="outline" onClick={onClick} className="gap-2">
            ไปที่ตั้งค่า <ArrowRight className="h-4 w-4" />
        </Button>
    )
}

export default GoToSettingsButton
