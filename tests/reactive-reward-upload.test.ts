import { beforeEach, describe, expect, it, vi } from "vitest";
import { UploadError, putToStorage, uploadKindOf, uploadProblem, uploadReactionMedia, UPLOAD_RULES } from "@/features/reactive-reward/upload";

const mocks = vi.hoisted(() => ({
    getUploadedFilesTotalSize: vi.fn(),
    beginUpload: vi.fn(),
    completeUpload: vi.fn(),
}));
vi.mock("@/services/uploadedFile.service", () => ({ getUploadedFilesTotalSize: mocks.getUploadedFilesTotalSize }));
vi.mock("@/features/reactive-reward/api/reactiveReward.api", () => ({
    reactiveRewardApi: { beginUpload: mocks.beginUpload, completeUpload: mocks.completeUpload },
}));

const MEGABYTE = 1024 * 1024;
const roomy = { total_size_kb: 0, max_storage_kb: 50 * 1024 };

describe("uploadProblem", () => {
    it("accepts a file of the right type and size", () => {
        expect(uploadProblem({ type: "image/png", size: 2 * MEGABYTE }, "image", roomy)).toBeNull();
        expect(uploadProblem({ type: "video/mp4", size: 20 * MEGABYTE }, "video", roomy)).toBeNull();
        expect(uploadProblem({ type: "video/webm", size: 1 }, "video", roomy)).toBeNull();
    });

    it("turns away an unsupported type", () => {
        expect(uploadProblem({ type: "video/quicktime", size: 1000 }, "video", roomy)).toMatch(/ประเภทไฟล์ไม่รองรับ/);
        expect(uploadProblem({ type: "image/svg+xml", size: 1000 }, "image", roomy)).toMatch(/ประเภทไฟล์ไม่รองรับ/);
        expect(uploadProblem({ type: "video/mp4", size: 1000 }, "image", roomy)).toMatch(/ประเภทไฟล์ไม่รองรับ/);
    });

    it("turns away a file one byte over the limit of its kind, naming both sizes", () => {
        expect(uploadProblem({ type: "image/png", size: 2 * MEGABYTE + 1 }, "image", roomy)).toMatch(/ไม่เกิน 2.0 MB/);
        expect(uploadProblem({ type: "video/mp4", size: 20 * MEGABYTE + 1 }, "video", roomy)).toMatch(/ไม่เกิน 20.0 MB.*20.0 MB/);
    });

    it("turns away a file that does not fit in the remaining storage, with the room that is left", () => {
        // A free account: 5 MB in all, 2 MB already used, so a 4 MB video cannot go in
        const free = { total_size_kb: 2 * 1024, max_storage_kb: 5 * 1024 };
        const message = uploadProblem({ type: "video/mp4", size: 4 * MEGABYTE }, "video", free);
        expect(message).toMatch(/พื้นที่จัดเก็บไม่พอ/);
        expect(message).toContain("เหลือ 3.0 MB");
        expect(message).toContain("4.0 MB");
        expect(uploadProblem({ type: "video/mp4", size: 3 * MEGABYTE }, "video", free)).toBeNull();
    });

    it("turns away any file when the storage is already over its limit", () => {
        expect(uploadProblem({ type: "image/png", size: 10 }, "image", { total_size_kb: 6000, max_storage_kb: 5 * 1024 })).toMatch(/เหลือ 0.0 MB/);
    });

    it("skips the storage check when usage is not known", () => {
        expect(uploadProblem({ type: "video/mp4", size: 20 * MEGABYTE }, "video", null)).toBeNull();
    });
});

describe("uploadKindOf", () => {
    it.each([
        ["image/webp", "image"],
        ["audio/mpeg", "audio"],
        ["video/mp4", "video"],
        ["application/pdf", null],
    ])("classifies %s as %s", (type, kind) => {
        expect(uploadKindOf({ type })).toBe(kind);
    });

    it("only claims types the rules list", () => {
        for (const rule of Object.values(UPLOAD_RULES)) expect(rule.types.length).toBeGreaterThan(0);
    });
});

class FakeRequest {
    static last: FakeRequest;
    method = "";
    url = "";
    headers: Record<string, string> = {};
    body: unknown;
    status = 200;
    aborted = false;
    upload: { onprogress: ((event: { lengthComputable: boolean; loaded: number; total: number }) => void) | null } = { onprogress: null };
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    onabort: (() => void) | null = null;
    constructor() { FakeRequest.last = this; }
    open(method: string, url: string) { this.method = method; this.url = url; }
    setRequestHeader(name: string, value: string) { this.headers[name] = value; }
    send(body: unknown) { this.body = body; }
    abort() { this.aborted = true; this.onabort?.(); }
}

describe("putToStorage", () => {
    beforeEach(() => vi.stubGlobal("XMLHttpRequest", FakeRequest));
    const file = new File(["bytes"], "clip.mp4", { type: "video/mp4" });

    it("PUTs the file to the presigned URL with its content type and reports progress", async () => {
        const progress = vi.fn();
        const pending = putToStorage("https://s3.test/put", file, progress);
        const request = FakeRequest.last;
        expect(request.method).toBe("PUT");
        expect(request.url).toBe("https://s3.test/put");
        expect(request.headers["Content-Type"]).toBe("video/mp4");
        expect(request.body).toBe(file);
        request.upload.onprogress?.({ lengthComputable: true, loaded: 25, total: 100 });
        request.upload.onprogress?.({ lengthComputable: true, loaded: 100, total: 100 });
        request.upload.onprogress?.({ lengthComputable: false, loaded: 0, total: 0 });
        request.onload?.();
        await expect(pending).resolves.toBeUndefined();
        expect(progress.mock.calls).toEqual([[25], [100]]);
    });

    it("fails with a Thai message when storage refuses the file", async () => {
        const pending = putToStorage("https://s3.test/put", file, vi.fn());
        FakeRequest.last.status = 403;
        FakeRequest.last.onload?.();
        await expect(pending).rejects.toBeInstanceOf(UploadError);
        await expect(pending).rejects.toThrow("อัปโหลดไฟล์ไม่สำเร็จ");
    });

    it("fails with a Thai message on a network error", async () => {
        const pending = putToStorage("https://s3.test/put", file, vi.fn());
        FakeRequest.last.onerror?.();
        await expect(pending).rejects.toThrow("เชื่อมต่อไม่ได้");
    });

    it("stops the transfer when cancelled", async () => {
        const controller = new AbortController();
        const pending = putToStorage("https://s3.test/put", file, vi.fn(), controller.signal);
        controller.abort();
        expect(FakeRequest.last.aborted).toBe(true);
        await expect(pending).rejects.toThrow("ยกเลิกการอัปโหลด");
    });
});

describe("uploadReactionMedia", () => {
    const calls: string[] = [];
    const duration = vi.hoisted(() => ({ seconds: null as number | null }));

    beforeEach(() => {
        calls.length = 0;
        vi.stubGlobal("XMLHttpRequest", FakeRequest);
        mocks.getUploadedFilesTotalSize.mockReset().mockImplementation(async () => (calls.push("storage"), roomy));
        mocks.beginUpload.mockReset().mockImplementation(async () => (calls.push("begin"), { token: "token-1", url: "https://s3.test/put" }));
        mocks.completeUpload.mockReset().mockImplementation(async () => (calls.push("complete"), { id: "file-1", key: "users/u/abc", name: "clip.mp4" }));
        // The browser reports the length through a media element it creates itself
        vi.stubGlobal("URL", Object.assign(URL, { createObjectURL: () => "blob:x", revokeObjectURL: () => undefined }));
        vi.spyOn(document, "createElement").mockImplementation(((tag: string) => {
            const element = { preload: "", onloadedmetadata: null as null | (() => void), onerror: null as null | (() => void), duration: duration.seconds ?? NaN, removeAttribute: () => undefined, set src(_value: string) { queueMicrotask(() => (duration.seconds === null ? element.onerror?.() : element.onloadedmetadata?.())); } };
            return tag === "video" || tag === "audio" ? element : document.createElementNS("http://www.w3.org/1999/xhtml", tag);
        }) as typeof document.createElement);
        duration.seconds = 5;
    });

    const run = async (file: File, kind: "image" | "audio" | "video") => {
        const pending = uploadReactionMedia(file, kind, vi.fn());
        // Let the checks run up to the point where the file is handed to storage
        await vi.waitFor(() => expect(FakeRequest.last?.body).toBe(file));
        FakeRequest.last.onload?.();
        return pending;
    };

    it("checks the storage, then registers the upload, sends the file and completes it, in that order", async () => {
        const file = new File(["x"], "clip.mp4", { type: "video/mp4" });
        FakeRequest.last = undefined as unknown as FakeRequest;
        const uploaded = await run(file, "video");
        expect(calls).toEqual(["storage", "begin", "complete"]);
        expect(mocks.beginUpload).toHaveBeenCalledWith({ name: "clip.mp4", size: 1, type: "video/mp4", kind: "video" });
        expect(mocks.completeUpload).toHaveBeenCalledWith("token-1");
        expect(uploaded).toMatchObject({ id: "file-1" });
    });

    it("never contacts the server about a file that does not fit", async () => {
        mocks.getUploadedFilesTotalSize.mockResolvedValue({ total_size_kb: 5 * 1024, max_storage_kb: 5 * 1024 });
        const file = new File(["x"], "clip.mp4", { type: "video/mp4" });
        await expect(uploadReactionMedia(file, "video", vi.fn())).rejects.toThrow("พื้นที่จัดเก็บไม่พอ");
        expect(mocks.beginUpload).not.toHaveBeenCalled();
    });

    it("never uploads a video the browser can see is longer than 30 seconds", async () => {
        duration.seconds = 31.2;
        const file = new File(["x"], "long.mp4", { type: "video/mp4" });
        await expect(uploadReactionMedia(file, "video", vi.fn())).rejects.toThrow("ต้องยาวไม่เกิน 30 วินาที (ไฟล์นี้ 32 วินาที)");
        expect(mocks.beginUpload).not.toHaveBeenCalled();
    });

    it("lets the server decide when the browser cannot read the length, which is how an HEVC file gets through", async () => {
        duration.seconds = null;
        FakeRequest.last = undefined as unknown as FakeRequest;
        const file = new File(["x"], "hevc.mp4", { type: "video/mp4" });
        await expect(run(file, "video")).resolves.toBeDefined();
        expect(mocks.beginUpload).toHaveBeenCalled();
    });

    it("does not look at the length of an image", async () => {
        FakeRequest.last = undefined as unknown as FakeRequest;
        const file = new File(["x"], "pic.png", { type: "image/png" });
        await run(file, "image");
        expect(document.createElement).not.toHaveBeenCalledWith("video");
    });

    it("still uploads when the storage usage cannot be fetched, leaving the server to enforce it", async () => {
        mocks.getUploadedFilesTotalSize.mockRejectedValue(new Error("offline"));
        FakeRequest.last = undefined as unknown as FakeRequest;
        const file = new File(["x"], "pic.png", { type: "image/png" });
        await expect(run(file, "image")).resolves.toBeDefined();
    });
});
