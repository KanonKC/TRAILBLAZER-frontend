import { Check } from 'lucide-react'

const WidgetEnabledBadge = () => {
  return (
    <div className="flex items-center gap-2 text-success bg-success/10 px-3 py-2 rounded-md border border-success/20 w-fit">
        <Check className="w-4 h-4" />
        <span className="text-sm font-medium">เปิดใช้งานแล้ว</span>
    </div>
  )
}

export default WidgetEnabledBadge