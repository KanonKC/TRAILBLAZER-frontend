"use client";

import { useState } from "react";
import type { UploadedFile } from "@/services/uploadedFile.service";
import {
    DEFAULT_DISPLAY_MS,
    DEFAULT_SIZE_PERCENT,
    DEFAULT_VOLUME,
} from "../constants";
import type { Reaction, ReactionDraft, ReactionFile, ReactionMediaType, ReactionPosition } from "../types";

/** A library file as the form needs it: enough to show it, play it and send its key. */
export interface PickedFile {
    id: string;
    key: string;
    name: string;
    type: string;
    url: string | null;
    sizeKb: number;
    durationMs: number | null;
}

export function pickedFromUpload(file: UploadedFile): PickedFile {
    return { id: file.id, key: file.key, name: file.name, type: file.type, url: file.url, sizeKb: file.size_kb, durationMs: file.duration_ms ?? null };
}

function pickedFromReaction(file: ReactionFile | null, url: string | null): PickedFile | null {
    return file ? { id: file.id, key: file.key, name: file.name, type: file.type, url, sizeKb: file.size_kb, durationMs: file.duration_ms } : null;
}

/** The shape the shared audio picker wants; it only reads the id, name and key. */
export function toUploadedFile(file: PickedFile): UploadedFile {
    return {
        id: file.id, key: file.key, name: file.name, type: file.type, url: file.url ?? "",
        size_kb: file.sizeKb, duration_ms: file.durationMs, owner_id: "", created_at: "", updated_at: "",
    };
}

export type SaveReaction = (draft: ReactionDraft, reactionId?: string) => Promise<boolean>;

/** The sheet's draft. The sheet is remounted per reaction, so this always starts from the one being edited. */
export function useReactionForm(reaction: Reaction | null, onSave: SaveReaction) {
    const [rewardId, setRewardId] = useState<string | null>(reaction?.twitch_reward_id ?? null);
    const [mediaType, setMediaTypeState] = useState<ReactionMediaType>(reaction?.media_type ?? "IMAGE");
    const [media, setMedia] = useState<PickedFile | null>(pickedFromReaction(reaction?.media_file ?? null, reaction?.media_url ?? null));
    const [sound, setSound] = useState<PickedFile | null>(pickedFromReaction(reaction?.sound_file ?? null, reaction?.sound_url ?? null));
    const [volume, setVolume] = useState(reaction?.volume ?? DEFAULT_VOLUME);
    const [displayMs, setDisplayMs] = useState(reaction?.display_duration_ms ?? DEFAULT_DISPLAY_MS);
    const [position, setPosition] = useState<ReactionPosition>(reaction?.position ?? "CENTER");
    const [sizePercent, setSizePercent] = useState(reaction?.size_percent ?? DEFAULT_SIZE_PERCENT);
    const [enabled, setEnabled] = useState(reaction?.enabled ?? true);
    const [isSaving, setIsSaving] = useState(false);

    /** A file of one kind is no use for another, so changing the type clears what was chosen. */
    const setMediaType = (next: ReactionMediaType) => {
        if (next === mediaType) return;
        setMediaTypeState(next);
        setMedia(null);
        setSound(null);
    };

    const hasSound = mediaType === "AUDIO" || mediaType === "VIDEO" || (mediaType === "IMAGE" && !!sound);
    const canSave = !!rewardId && !!media && !isSaving;

    const save = async () => {
        if (!rewardId || !media) return false;
        setIsSaving(true);
        try {
            return await onSave(
                {
                    twitch_reward_id: rewardId,
                    enabled,
                    media_type: mediaType,
                    media_key: media.key,
                    sound_key: mediaType === "IMAGE" ? (sound?.key ?? null) : null,
                    volume,
                    display_duration_ms: displayMs,
                    position,
                    size_percent: sizePercent,
                },
                reaction?.id,
            );
        } finally {
            setIsSaving(false);
        }
    };

    return {
        rewardId, setRewardId,
        mediaType, setMediaType,
        media, setMedia,
        sound, setSound,
        volume, setVolume,
        displayMs, setDisplayMs,
        position, setPosition,
        sizePercent, setSizePercent,
        enabled, setEnabled,
        hasSound,
        isSaving,
        canSave,
        save,
    };
}
