import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReplyMessageInputProps {
    value: string;
    onChange: (value: string) => void;
}

export function ReplyMessageInput({ value, onChange }: ReplyMessageInputProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="qs_reply_message" className="text-white">ข้อความตอบกลับ</Label>
            <Input
                id="qs_reply_message"
                placeholder="ยินดีต้อนรับสู่สตรีมนะ {{user_name}}!"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-transparent border-white/20 text-white placeholder:text-white/40"
            />
            <p className="text-xs text-white/50">
                ตัวแปรที่ใช้ได้: <code className="bg-white/10 px-1 rounded text-white/90">{"{{user_name}}"}</code>, <code className="bg-white/10 px-1 rounded text-white/90">{"{{message_text}}"}</code>
            </p>
        </div>
    );
}
