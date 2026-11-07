import { Button } from '@/components/ui/button'
import { Cog, Settings } from 'lucide-react'

interface GoToSettingsButtonProps {
    onClick: () => void
}

const GoToSettingsButton = ({ onClick }: GoToSettingsButtonProps) => {
    return (
        <Button variant="outline" onClick={onClick} className="gap-2 bg-secondary border-border hover:bg-secondary hover:text-primary">
            <Settings className="h-4 w-4" /> ไปที่การตั้งค่าวิดเจ็ต
        </Button>
    )
}

export default GoToSettingsButton
