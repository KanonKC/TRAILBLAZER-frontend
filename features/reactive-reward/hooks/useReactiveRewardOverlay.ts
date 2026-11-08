"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useOverlayEventSource } from "@/hooks/use-overlay-event-source";
import { ackOverlayJobWithRetry } from "@/lib/overlay-queue";
import { getReactiveRewardEventUrl } from "../api/reactiveReward.api";
import { WIDGET_SLUG } from "../constants";
import type { ReactionMediaType, ReactionPlayEvent } from "../types";

/** How long an item may take to become ready before it is skipped. */
export const READY_TIMEOUT_MS = 8000;
/** Extra time a sound or video gets past its known length to report `ended` before it is cut off. */
export const ENDED_GRACE_MS = 2000;
const MAX_REMEMBERED_JOBS = 500;
const MEDIA_TYPES: ReactionMediaType[] = ["IMAGE", "AUDIO", "VIDEO"];

export interface OverlayPlayback {
    event: ReactionPlayEvent;
    /** False while an item is still loading: a video is mounted early but hidden until it can play. */
    visible: boolean;
}

interface ActivePlayback {
    event: ReactionPlayEvent;
    finished: boolean;
    timers: ReturnType<typeof setTimeout>[];
    readyTimer: ReturnType<typeof setTimeout> | null;
    /** A sound item, or the sound that goes with an image. */
    audio: HTMLAudioElement | null;
    video: HTMLVideoElement | null;
}

function toEvent(raw: string): ReactionPlayEvent | null {
    try {
        const event = JSON.parse(raw) as Partial<ReactionPlayEvent>;
        if (
            typeof event.jobId !== "string" ||
            typeof event.media_url !== "string" ||
            typeof event.display_ms !== "number" ||
            !MEDIA_TYPES.includes(event.media_type as ReactionMediaType)
        ) {
            return null;
        }
        return event as ReactionPlayEvent;
    } catch {
        return null;
    }
}

/** Resolves once the browser has decoded the image, so it appears whole instead of painting in. */
function loadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = url;
        if (typeof image.decode === "function") {
            image.decode().then(resolve, reject);
            return;
        }
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("image failed to load"));
    });
}

const toVolume = (percent: number) => Math.min(1, Math.max(0, percent / 100));

/** A click has unlocked sound, so a video that was started silently can speak. */
function unmuteAndPlay(element: HTMLVideoElement): Promise<void> {
    element.muted = false;
    return element.play();
}

/** The item became playable in time, so the "not ready" timeout no longer applies. */
function markReady(active: ActivePlayback) {
    if (active.readyTimer) clearTimeout(active.readyTimer);
    active.readyTimer = null;
}

/**
 * Plays reactions from the overlay event stream one at a time and tells the backend queue when each one ended, so
 * the next viewer's reaction starts right away. Every way an item can fail ends with the queue moving on.
 */
export function useReactiveRewardOverlay(userId: string, key?: string) {
    const [current, setCurrent] = useState<OverlayPlayback | null>(null);
    const [connected, setConnected] = useState(false);
    const [audioBlocked, setAudioBlocked] = useState(false);
    const activeRef = useRef<ActivePlayback | null>(null);
    const seenJobIds = useRef(new Set<string>());
    const targetRef = useRef({ userId, key });

    useEffect(() => {
        targetRef.current = { userId, key };
    }, [userId, key]);

    // OBS shows whatever is behind the page, so the page itself must not paint a background
    useEffect(() => {
        const bodyBackground = document.body.style.background;
        const htmlBackground = document.documentElement.style.background;
        document.body.style.background = "transparent";
        document.documentElement.style.background = "transparent";
        return () => {
            document.body.style.background = bodyBackground;
            document.documentElement.style.background = htmlBackground;
        };
    }, []);

    /** Silences and forgets the running item without acking it. */
    const stopActive = useCallback(() => {
        const active = activeRef.current;
        if (!active) return;
        active.finished = true;
        active.timers.forEach(clearTimeout);
        if (active.readyTimer) clearTimeout(active.readyTimer);
        active.audio?.pause();
        active.video?.pause();
        activeRef.current = null;
    }, []);

    /** Ends the item, hides it and reports it to the queue. A second call for the same item does nothing. */
    const finish = useCallback((active: ActivePlayback) => {
        if (active.finished || activeRef.current !== active) return;
        const { jobId } = active.event;
        stopActive();
        setCurrent(null);
        const target = targetRef.current;
        void ackOverlayJobWithRetry(WIDGET_SLUG, target.userId, jobId, target.key);
    }, [stopActive]);

    const isRunning = useCallback((active: ActivePlayback) => !active.finished && activeRef.current === active, []);

    /** Safety net: an item that never reports `ended` is still released once its length has passed. */
    const releaseAfter = useCallback((active: ActivePlayback, delayMs: number) => {
        active.timers.push(setTimeout(() => finish(active), delayMs));
    }, [finish]);

    const playImage = useCallback((active: ActivePlayback) => {
        const { event } = active;
        loadImage(event.media_url).then(
            () => {
                if (!isRunning(active)) return;
                markReady(active);
                setCurrent({ event, visible: true });
                if (event.sound_url) {
                    const sound = new Audio(event.sound_url);
                    sound.volume = toVolume(event.volume);
                    active.audio = sound;
                    // A blocked sound is skipped: the image still shows for its full time
                    sound.play().catch(() => setAudioBlocked(true));
                }
                releaseAfter(active, event.display_ms);
            },
            () => finish(active),
        );
    }, [finish, isRunning, releaseAfter]);

    const playSound = useCallback((active: ActivePlayback) => {
        const { event } = active;
        const sound = new Audio();
        sound.preload = "auto";
        sound.volume = toVolume(event.volume);
        active.audio = sound;
        sound.addEventListener("ended", () => finish(active));
        sound.addEventListener("error", () => finish(active));
        sound.addEventListener("canplay", () => {
            if (!isRunning(active)) return;
            markReady(active);
            sound.play().then(
                () => releaseAfter(active, event.display_ms + ENDED_GRACE_MS),
                () => {
                    // Nothing to show instead, so a sound that cannot play is simply released
                    setAudioBlocked(true);
                    finish(active);
                },
            );
        }, { once: true });
        sound.src = event.media_url;
    }, [finish, isRunning, releaseAfter]);

    const begin = useCallback((event: ReactionPlayEvent) => {
        const active: ActivePlayback = { event, finished: false, timers: [], readyTimer: null, audio: null, video: null };
        activeRef.current = active;
        setCurrent({ event, visible: false });
        active.readyTimer = setTimeout(() => finish(active), READY_TIMEOUT_MS);
        if (event.media_type === "IMAGE") playImage(active);
        else if (event.media_type === "AUDIO") playSound(active);
        // A video is driven by the element the page mounts, through the handlers below
    }, [finish, playImage, playSound]);

    const handleEvent = useCallback((message: MessageEvent) => {
        const event = toEvent(message.data);
        if (!event || seenJobIds.current.has(event.jobId)) return;
        seenJobIds.current.add(event.jobId);
        if (seenJobIds.current.size > MAX_REMEMBERED_JOBS) {
            seenJobIds.current.delete(seenJobIds.current.values().next().value as string);
        }
        stopActive();
        begin(event);
    }, [begin, stopActive]);

    useOverlayEventSource(userId ? getReactiveRewardEventUrl(userId, key) : null, "reaction-play", handleEvent, {
        onOpen: () => setConnected(true),
        onError: () => setConnected(false),
    });

    useEffect(() => stopActive, [stopActive]);

    /** Handlers for the <video> element of the item that is playing, matched by job so a stale element is ignored. */
    const video = {
        onCanPlay: (jobId: string, element: HTMLVideoElement) => {
            const active = activeRef.current;
            if (!active || active.event.jobId !== jobId || active.video || !isRunning(active)) return;
            active.video = element;
            markReady(active);
            element.volume = toVolume(active.event.volume);
            const show = () => {
                setCurrent({ event: active.event, visible: true });
                releaseAfter(active, active.event.display_ms + ENDED_GRACE_MS);
            };
            element.play().then(show, () => {
                // Autoplay with sound was refused: play it silently rather than not at all
                setAudioBlocked(true);
                element.muted = true;
                element.play().then(show, () => finish(active));
            });
        },
        onEnded: (jobId: string) => {
            const active = activeRef.current;
            if (active && active.event.jobId === jobId) finish(active);
        },
        onError: (jobId: string) => {
            const active = activeRef.current;
            if (active && active.event.jobId === jobId) finish(active);
        },
    };

    /** For a regular browser tab: a click unlocks sound for the rest of the page's life. OBS never needs it. */
    const enableAudio = useCallback(() => {
        setAudioBlocked(false);
        const element = activeRef.current?.video;
        if (element) unmuteAndPlay(element).catch(() => setAudioBlocked(true));
    }, []);

    return { current, connected, audioBlocked, enableAudio, video };
}
