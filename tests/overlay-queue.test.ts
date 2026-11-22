import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ackOverlayJobWithRetry } from "@/lib/overlay-queue";

const respond = (status: number) => ({ ok: status >= 200 && status < 300, status }) as Response;

describe("ackOverlayJobWithRetry", () => {
    const fetchMock = vi.fn();

    beforeEach(() => {
        vi.useFakeTimers();
        fetchMock.mockReset();
        vi.stubGlobal("fetch", fetchMock);
        vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.test");
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
        vi.unstubAllEnvs();
    });

    const run = async () => {
        const result = ackOverlayJobWithRetry("reactive-reward", "user-1", "job-1", "secret");
        await vi.runAllTimersAsync();
        return result;
    };

    it("posts the job id to the queue's ack route for the widget, with the overlay key", async () => {
        fetchMock.mockResolvedValue(respond(204));
        await expect(run()).resolves.toBe(true);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [url, init] = fetchMock.mock.calls[0];
        const parsed = new URL(url);
        expect(parsed.origin).toBe("https://api.example.test");
        expect(parsed.pathname).toBe("/api/v1/overlay-queue/user-1/reactive-reward/ack");
        expect(parsed.searchParams.get("key")).toBe("secret");
        expect(init.method).toBe("POST");
        expect(JSON.parse(init.body)).toEqual({ jobId: "job-1" });
    });

    it("tries again after a network error", async () => {
        fetchMock.mockRejectedValueOnce(new TypeError("offline")).mockResolvedValue(respond(204));
        await expect(run()).resolves.toBe(true);
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("tries again after a server error, and succeeds on the third attempt", async () => {
        fetchMock.mockResolvedValueOnce(respond(503)).mockResolvedValueOnce(respond(500)).mockResolvedValue(respond(204));
        await expect(run()).resolves.toBe(true);
        expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it("gives up after three attempts and leaves the queue to its own ceiling, without throwing", async () => {
        fetchMock.mockResolvedValue(respond(500));
        await expect(run()).resolves.toBe(false);
        expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it("gives up after three network errors without throwing", async () => {
        fetchMock.mockRejectedValue(new TypeError("offline"));
        await expect(run()).resolves.toBe(false);
        expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it.each([400, 401, 404])("does not retry an answer of %i, which a retry cannot change", async (status) => {
        fetchMock.mockResolvedValue(respond(status));
        await expect(run()).resolves.toBe(false);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("waits a little longer before each retry", async () => {
        fetchMock.mockResolvedValue(respond(500));
        const pending = ackOverlayJobWithRetry("reactive-reward", "user-1", "job-1", "secret");
        await vi.advanceTimersByTimeAsync(0);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        await vi.advanceTimersByTimeAsync(399);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        await vi.advanceTimersByTimeAsync(1);
        expect(fetchMock).toHaveBeenCalledTimes(2);
        await vi.advanceTimersByTimeAsync(799);
        expect(fetchMock).toHaveBeenCalledTimes(2);
        await vi.advanceTimersByTimeAsync(1);
        expect(fetchMock).toHaveBeenCalledTimes(3);
        await expect(pending).resolves.toBe(false);
    });

    it("sends nothing without a job id", async () => {
        await expect(ackOverlayJobWithRetry("reactive-reward", "user-1", undefined, "secret")).resolves.toBe(false);
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
