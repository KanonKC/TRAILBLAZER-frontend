import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface WidgetTestControlProps {
    isSaving: boolean;
    isTesting: boolean;
    onSave: () => void;
    onTest: () => void;
    canTest: boolean;
}

export function WidgetTestControl({ isSaving, isTesting, onSave, onTest, canTest }: WidgetTestControlProps) {
    return (
        <div className="space-y-3">
            <p className="text-sm text-white/70">ทดสอบว่าการทำงานทั้งหมดถูกต้อง ลองกดที่ปุ่ม Test ด้านล่าง</p>

            <ul className="text-sm text-white/70 list-disc pl-5 space-y-1 mt-2">
                <li>ต้องมีข้อความแสดงขึ้นมาบนช่องแชท Twitch ของคุณ</li>
                <li>ต้องมีเสียงดังออกมาจากโปรแกรม OBS</li>
            </ul>
            <div className="flex flex-wrap gap-2">
                <Button onClick={onSave} disabled={isSaving}>
                    {isSaving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                </Button>
                <Button
                    variant="outline"
                    onClick={onTest}
                    disabled={isTesting || !canTest}
                    className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                    {isTesting ? "กำลังทดสอบ..." : (
                        <>
                            <Play className="mr-2 h-4 w-4" />
                            Test
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
