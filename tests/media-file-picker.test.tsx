import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MediaFilePicker } from "@/features/reactive-reward/components/MediaFilePicker";
import { UploadError } from "@/features/reactive-reward/upload";
import type { PickedFile } from "@/features/reactive-reward/hooks/useReactionForm";

const mocks = vi.hoisted(() => ({ getUploadedFiles: vi.fn(), uploadReactionMedia: vi.fn() }));
vi.mock("@/services/uploadedFile.service", () => ({ getUploadedFiles: mocks.getUploadedFiles, getUploadedFilesTotalSize: vi.fn() }));
vi.mock("@/features/reactive-reward/upload", async (importOriginal) => ({
    ...(await importOriginal<typeof import("@/features/reactive-reward/upload")>()),
    uploadReactionMedia: mocks.uploadReactionMedia,
}));

const picked = (overrides: Partial<PickedFile> = {}): PickedFile => ({
    id: "f1", key: "k1", name: "clip.mp4", type: "video/mp4", url: "https://cdn.test/clip.mp4", sizeKb: 40, durationMs: null, ...overrides,
});
const uploaded = { id: "f2", key: "k2", name: "new.png", type: "image/png", url: "https://cdn.test/new.png", size_kb: 12, duration_ms: null, owner_id: "u", created_at: "", updated_at: "" };

beforeEach(() => {
    vi.clearAllMocks();
    mocks.getUploadedFiles.mockResolvedValue({ data: [uploaded, { ...uploaded, id: "f3", key: "k3", name: "other.png" }], pagination: { total: 2, page: 1, limit: 100 } });
});

const chooseLocalFile = (kind: "image" | "video", file: File) => {
    fireEvent.change(screen.getByTestId(`${kind}-file-input`), { target: { files: [file] } });
};

describe("MediaFilePicker", () => {
    it("says there is no file yet", () => {
        render(<MediaFilePicker kind="image" value={null} onChange={vi.fn()} />);
        expect(screen.getByText("ยังไม่ได้เลือกไฟล์")).toBeInTheDocument();
    });

    it.each([
        [40, null, "40 KB"],
        [1, null, "1 KB"],
        [0.2, null, "1 KB"],
        [1536, null, "1.5 MB"],
        [20480, 12_500, "20.0 MB · 12.5 วินาที"],
    ])("shows a file of %s KB (length %s) as %s, never as 0.0 MB", (sizeKb, durationMs, expected) => {
        render(<MediaFilePicker kind="video" value={picked({ sizeKb, durationMs })} onChange={vi.fn()} />);
        expect(screen.getByText("clip.mp4")).toBeInTheDocument();
        expect(screen.getByText(expected)).toBeInTheDocument();
    });

    it("gives each kind its own accepted types and hint", () => {
        const { rerender } = render(<MediaFilePicker kind="image" value={null} onChange={vi.fn()} />);
        expect(screen.getByTestId("image-file-input")).toHaveAttribute("accept", expect.stringContaining("image/png"));
        expect(screen.getByText(/ไม่เกิน 2 MB/)).toBeInTheDocument();
        rerender(<MediaFilePicker kind="video" value={null} onChange={vi.fn()} />);
        expect(screen.getByTestId("video-file-input")).toHaveAttribute("accept", "video/mp4,video/webm");
        expect(screen.getByText(/ไม่เกิน 20 MB และยาวไม่เกิน 30 วินาที/)).toBeInTheDocument();
    });

    describe("uploading a new file", () => {
        it("hands the uploaded file to the form", async () => {
            mocks.uploadReactionMedia.mockResolvedValue(uploaded);
            const onChange = vi.fn();
            render(<MediaFilePicker kind="image" value={null} onChange={onChange} />);
            chooseLocalFile("image", new File(["x"], "new.png", { type: "image/png" }));
            await waitFor(() => expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ id: "f2", key: "k2", name: "new.png", sizeKb: 12 })));
            expect(mocks.uploadReactionMedia).toHaveBeenCalledWith(expect.any(File), "image", expect.any(Function), expect.any(AbortSignal));
        });

        it("turns away a file of the wrong type or size without uploading anything", () => {
            const onChange = vi.fn();
            render(<MediaFilePicker kind="image" value={null} onChange={onChange} />);
            chooseLocalFile("image", new File(["x"], "clip.mp4", { type: "video/mp4" }));
            expect(screen.getByRole("alert")).toHaveTextContent("ประเภทไฟล์ไม่รองรับ");
            expect(mocks.uploadReactionMedia).not.toHaveBeenCalled();
            expect(onChange).not.toHaveBeenCalled();
        });

        it("shows the reason an upload failed, and keeps the file that was already chosen", async () => {
            mocks.uploadReactionMedia.mockRejectedValue(new UploadError("พื้นที่จัดเก็บไม่พอ เหลือ 1.0 MB แต่ไฟล์นี้ 4.0 MB"));
            const onChange = vi.fn();
            render(<MediaFilePicker kind="video" value={picked()} onChange={onChange} />);
            chooseLocalFile("video", new File(["x"], "big.mp4", { type: "video/mp4" }));
            expect(await screen.findByRole("alert")).toHaveTextContent("พื้นที่จัดเก็บไม่พอ");
            expect(onChange).not.toHaveBeenCalled();
            expect(screen.getByText("clip.mp4")).toBeInTheDocument();
        });

        it("shows progress while uploading, and lets the streamer cancel", async () => {
            let report: (percent: number) => void = () => undefined;
            let signal: AbortSignal | undefined;
            mocks.uploadReactionMedia.mockImplementation((_file, _kind, onProgress, abortSignal) => {
                report = onProgress;
                signal = abortSignal;
                return new Promise((_resolve, reject) => abortSignal.addEventListener("abort", () => reject(new UploadError("ยกเลิกการอัปโหลดแล้ว"))));
            });
            render(<MediaFilePicker kind="video" value={null} onChange={vi.fn()} />);
            chooseLocalFile("video", new File(["x"], "clip.mp4", { type: "video/mp4" }));
            expect(await screen.findByRole("status")).toBeInTheDocument();
            report(42);
            expect(await screen.findByText("กำลังอัปโหลด 42%")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "อัปโหลดไฟล์ใหม่" })).toBeDisabled();
            fireEvent.click(screen.getByRole("button", { name: "ยกเลิก" }));
            expect(signal?.aborted).toBe(true);
            await waitFor(() => expect(screen.queryByRole("status")).toBeNull());
            // A cancel is the streamer's own doing, so it is not reported as an error
            expect(screen.queryByRole("alert")).toBeNull();
        });
    });

    describe("choosing from the library", () => {
        it("lists only files of this kind and selects one", async () => {
            const onChange = vi.fn();
            render(<MediaFilePicker kind="image" value={null} onChange={onChange} />);
            fireEvent.click(screen.getByRole("button", { name: "เลือกจากไฟล์ของฉัน" }));
            const dialog = await screen.findByRole("dialog");
            expect(mocks.getUploadedFiles).toHaveBeenCalledWith({ type: "image", page: 1, limit: 100 });
            fireEvent.click(await within(dialog).findByRole("button", { name: /other\.png/ }));
            expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ key: "k3", name: "other.png" }));
            await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
        });

        it("marks the file that is already chosen", async () => {
            render(<MediaFilePicker kind="image" value={picked({ key: "k2", name: "new.png" })} onChange={vi.fn()} />);
            fireEvent.click(screen.getByRole("button", { name: "เลือกจากไฟล์ของฉัน" }));
            const dialog = await screen.findByRole("dialog");
            expect(await within(dialog).findByRole("button", { name: /new\.png/ })).toHaveAttribute("aria-pressed", "true");
        });

        it("says when the library has nothing of this kind", async () => {
            mocks.getUploadedFiles.mockResolvedValue({ data: [], pagination: { total: 0, page: 1, limit: 100 } });
            render(<MediaFilePicker kind="video" value={null} onChange={vi.fn()} />);
            fireEvent.click(screen.getByRole("button", { name: "เลือกจากไฟล์ของฉัน" }));
            expect(await screen.findByText("ไม่พบข้อมูล")).toBeInTheDocument();
        });

        it("says when the library could not be loaded", async () => {
            mocks.getUploadedFiles.mockRejectedValue(new Error("offline"));
            render(<MediaFilePicker kind="image" value={null} onChange={vi.fn()} />);
            fireEvent.click(screen.getByRole("button", { name: "เลือกจากไฟล์ของฉัน" }));
            expect(await screen.findByText("โหลดรายการไฟล์ไม่สำเร็จ กรุณาลองใหม่")).toBeInTheDocument();
        });

        it("loads the list fresh each time it is opened", async () => {
            render(<MediaFilePicker kind="image" value={null} onChange={vi.fn()} />);
            fireEvent.click(screen.getByRole("button", { name: "เลือกจากไฟล์ของฉัน" }));
            await screen.findByRole("dialog");
            fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
            await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
            fireEvent.click(screen.getByRole("button", { name: "เลือกจากไฟล์ของฉัน" }));
            await screen.findByRole("dialog");
            expect(mocks.getUploadedFiles).toHaveBeenCalledTimes(2);
        });
    });
});
