import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AudioFileUploader } from "@/components/widget/AudioFileUploader/AudioFileUploader";
import { CompactAudioFileUploader } from "@/components/widget/AudioFileUploader/CompactAudioFileUploader";

const audioMocks = vi.hoisted(() => ({ getUploadedFile: vi.fn(), play: vi.fn(), pause: vi.fn() }));
vi.mock("@/services/uploadedFile.service", () => ({ getUploadedFile: audioMocks.getUploadedFile }));
vi.mock("@/components/widget/AudioFileUploader/AudioFileUploaderDialog", () => ({ default: () => null }));

class FakeAudio {
    volume = 1;
    currentTime = 0;
    onended: (() => void) | null = null;
    constructor(public src: string) {}
    play() { audioMocks.play(); return Promise.resolve(); }
    pause() { audioMocks.pause(); }
}

describe.each([
    ["full", AudioFileUploader],
    ["compact", CompactAudioFileUploader],
])("%s audio preview", (_name, Component) => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal("Audio", FakeAudio);
        audioMocks.getUploadedFile.mockResolvedValue({ url: "https://example.test/audio.mp3" });
    });

    it("loads, plays and stops the selected file", async () => {
        const { container } = render(<Component selectedFile={{ id: "file-1" } as Parameters<typeof Component>[0]["selectedFile"]} currentFileName="clip.mp3" onFileSelect={vi.fn()} audioVolume={25} />);
        fireEvent.click(container.querySelector(".lucide-play")!.closest("button")!);
        await waitFor(() => expect(audioMocks.play).toHaveBeenCalledOnce());
        expect(audioMocks.getUploadedFile).toHaveBeenCalledWith("file-1");
        fireEvent.click(container.querySelector(".lucide-square")!.closest("button")!);
        expect(audioMocks.pause).toHaveBeenCalledOnce();
    });
});
