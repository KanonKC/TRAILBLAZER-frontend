import { getUploadedFilesTotalSize, type UploadedFile } from "@/services/uploadedFile.service";
import { reactiveRewardApi } from "./api/reactiveReward.api";

export type UploadKind = "image" | "audio" | "video";

const MEGABYTE = 1024 * 1024;
const MAX_TIMED_MEDIA_SECONDS = 30;
const METADATA_TIMEOUT_MS = 10_000;

/** Mirrors the backend rules, so an unusable file is turned away before it is uploaded. */
export const UPLOAD_RULES: Record<UploadKind, { types: string[]; maxBytes: number; label: string; accept: string }> = {
    image: {
        types: ["image/png", "image/jpeg", "image/gif", "image/webp", "image/avif"],
        maxBytes: 2 * MEGABYTE,
        label: "รูปภาพ",
        accept: "image/png,image/jpeg,image/gif,image/webp,image/avif",
    },
    audio: {
        types: ["audio/mpeg", "audio/mp3", "audio/ogg", "application/ogg", "audio/wav", "audio/x-wav", "audio/wave"],
        maxBytes: 2 * MEGABYTE,
        label: "เสียง",
        accept: "audio/mpeg,audio/ogg,audio/wav",
    },
    video: {
        types: ["video/mp4", "video/webm"],
        maxBytes: 20 * MEGABYTE,
        label: "วิดีโอ",
        accept: "video/mp4,video/webm",
    },
};

export class UploadError extends Error {}

const megabytes = (bytes: number) => (bytes / MEGABYTE).toFixed(1);

export interface StorageUsage {
    total_size_kb: number;
    max_storage_kb: number;
}

/**
 * Why a file cannot be used as `kind`, in Thai, or null when it can. `storage` is the owner's current usage, so a
 * file that would not fit is refused up front instead of after a long upload.
 */
export function uploadProblem(file: { type: string; size: number }, kind: UploadKind, storage: StorageUsage | null): string | null {
    const rule = UPLOAD_RULES[kind];
    if (!rule.types.includes(file.type)) return `ประเภทไฟล์ไม่รองรับ (${rule.label}ใช้ได้เฉพาะ ${rule.accept.replaceAll(`${kind}/`, "").replaceAll(",", ", ")})`;
    if (file.size > rule.maxBytes) return `ไฟล์${rule.label}ต้องไม่เกิน ${megabytes(rule.maxBytes)} MB (ไฟล์นี้ ${megabytes(file.size)} MB)`;
    if (storage) {
        const remainingBytes = Math.max(0, storage.max_storage_kb - storage.total_size_kb) * 1024;
        if (file.size > remainingBytes) {
            return `พื้นที่จัดเก็บไม่พอ เหลือ ${megabytes(remainingBytes)} MB แต่ไฟล์นี้ ${megabytes(file.size)} MB กรุณาลบไฟล์ที่ไม่ใช้แล้วลองใหม่`;
        }
    }
    return null;
}

/** Which upload kind a file belongs to, or null when it is none of them. */
export function uploadKindOf(file: { type: string }): UploadKind | null {
    return (Object.keys(UPLOAD_RULES) as UploadKind[]).find((kind) => UPLOAD_RULES[kind].types.includes(file.type)) ?? null;
}

/**
 * Length in seconds as the browser reads it, or null when it cannot be read. A null is not an error: a codec this
 * browser cannot decode may still be fine, and the server makes the final call.
 */
export function readLocalDurationSeconds(file: File, kind: "audio" | "video"): Promise<number | null> {
    return new Promise((resolve) => {
        const element = document.createElement(kind);
        const objectUrl = URL.createObjectURL(file);
        const finish = (seconds: number | null) => {
            clearTimeout(timer);
            URL.revokeObjectURL(objectUrl);
            element.removeAttribute("src");
            resolve(seconds);
        };
        const timer = setTimeout(() => finish(null), METADATA_TIMEOUT_MS);
        element.preload = "metadata";
        element.onloadedmetadata = () => finish(Number.isFinite(element.duration) ? element.duration : null);
        element.onerror = () => finish(null);
        element.src = objectUrl;
    });
}

/** PUTs the file straight to object storage and reports progress, which fetch cannot do. */
export function putToStorage(url: string, file: File, onProgress: (percent: number) => void, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("PUT", url);
        request.setRequestHeader("Content-Type", file.type);
        request.upload.onprogress = (event) => {
            if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
        };
        request.onload = () =>
            request.status >= 200 && request.status < 300
                ? resolve()
                : reject(new UploadError("อัปโหลดไฟล์ไม่สำเร็จ กรุณาลองใหม่"));
        request.onerror = () => reject(new UploadError("เชื่อมต่อไม่ได้ อัปโหลดไฟล์ไม่สำเร็จ กรุณาลองใหม่"));
        request.onabort = () => reject(new UploadError("ยกเลิกการอัปโหลดแล้ว"));
        signal?.addEventListener("abort", () => request.abort(), { once: true });
        request.send(file);
    });
}

/**
 * Checks, uploads and registers a file. Throws UploadError with a Thai message for anything the streamer can fix
 * (type, size, space, length); API errors from the server are passed through for the caller to show.
 */
export async function uploadReactionMedia(
    file: File,
    kind: UploadKind,
    onProgress: (percent: number) => void,
    signal?: AbortSignal,
): Promise<UploadedFile> {
    const storage = await getUploadedFilesTotalSize().catch(() => null);
    const problem = uploadProblem(file, kind, storage);
    if (problem) throw new UploadError(problem);

    if (kind !== "image") {
        const seconds = await readLocalDurationSeconds(file, kind);
        if (seconds !== null && seconds > MAX_TIMED_MEDIA_SECONDS) {
            throw new UploadError(`${UPLOAD_RULES[kind].label}ต้องยาวไม่เกิน ${MAX_TIMED_MEDIA_SECONDS} วินาที (ไฟล์นี้ ${Math.ceil(seconds)} วินาที)`);
        }
    }

    const { token, url } = await reactiveRewardApi.beginUpload({ name: file.name, size: file.size, type: file.type, kind });
    // The presigned URL talks to object storage directly, so it bypasses the application API client
    await putToStorage(url, file, onProgress, signal);
    return reactiveRewardApi.completeUpload(token);
}
