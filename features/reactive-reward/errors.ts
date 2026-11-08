import { UploadError } from "./upload";

/** The server's own wording for the cases a streamer can act on, in Thai. Anything else is shown as the server wrote it. */
const THAI_MESSAGES: [match: string, thai: string][] = [
    ["No overlay is connected", "ยังไม่มีโอเวอร์เลย์ที่เชื่อมต่ออยู่ กรุณาเปิดลิงก์โอเวอร์เลย์ใน OBS ก่อน"],
    ["Enable this widget before testing", "กรุณาเปิดใช้งานวิดเจ็ตก่อนทดสอบ"],
    ["Reward is already bound", "แต้มช่องนี้ถูกใช้กับวิดเจ็ตอื่นอยู่แล้ว"],
    ["Reward does not belong to your channel", "ไม่พบแต้มช่องนี้ในช่องของคุณ"],
    ["Reaction limit reached", "สร้าง Reaction ครบจำนวนสูงสุดแล้ว"],
    ["Select an uploaded file you own", "ไม่พบไฟล์นี้ในคลังของคุณ กรุณาเลือกหรืออัปโหลดใหม่"],
    ["Invalid video file", "อ่านไฟล์วิดีโอนี้ไม่ได้ ลองใช้ไฟล์ MP4 หรือ WebM ไฟล์อื่น"],
    ["Invalid audio file", "อ่านไฟล์เสียงนี้ไม่ได้ ลองใช้ไฟล์ MP3, WAV หรือ OGG ไฟล์อื่น"],
    ["Video must be at most 30 seconds", "วิดีโอต้องยาวไม่เกิน 30 วินาที"],
    ["Audio must be at most 30 seconds", "เสียงต้องยาวไม่เกิน 30 วินาที"],
    ["Sound must be at most 30 seconds", "เสียงประกอบต้องยาวไม่เกิน 30 วินาที"],
    ["Upload expired", "การอัปโหลดหมดอายุ กรุณาอัปโหลดใหม่"],
    // The checks every chosen file goes through when a reaction is saved
    ["must be png, jpeg, gif, webp or avif", "รูปภาพต้องเป็นไฟล์ PNG, JPG, GIF, WebP หรือ AVIF"],
    ["must be mp3, wav or ogg", "ไฟล์เสียงต้องเป็น MP3, WAV หรือ OGG"],
    ["must be mp4 or webm", "วิดีโอต้องเป็นไฟล์ MP4 หรือ WebM"],
    ["must be at most 2 MB", "ไฟล์ต้องมีขนาดไม่เกิน 2 MB"],
    ["must be at most 20 MB", "วิดีโอต้องมีขนาดไม่เกิน 20 MB"],
    ["must be at most 30 seconds", "ไฟล์ต้องยาวไม่เกิน 30 วินาที"],
    ["duration could not be read", "อ่านความยาวของวิดีโอไม่ได้ กรุณาอัปโหลดไฟล์ใหม่"],
    ["Only an image can have a separate sound", "เสียงแยกใช้ได้เฉพาะ Reaction ที่เป็นรูปภาพ"],
];

interface ApiError {
    response?: { data?: { message?: unknown } };
}

/** What to tell the streamer about a failed request: a Thai sentence when we have one, else the server's message. */
export function describeError(error: unknown): string | undefined {
    if (error instanceof UploadError) return error.message;
    const message = (error as ApiError)?.response?.data?.message;
    if (typeof message !== "string" || !message) return undefined;
    return THAI_MESSAGES.find(([match]) => message.includes(match))?.[1] ?? message;
}
