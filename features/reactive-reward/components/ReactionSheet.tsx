"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import SubLabel from "@/components/SubLabel";
import { TestWidgetButton } from "@/components/button/TestWidgetButton";
import { ChannelRewardSelector, type SelectableReward } from "@/components/widget/ChannelRewardSelector";
import { CompactAudioFileUploader } from "@/components/widget/AudioFileUploader/CompactAudioFileUploader";
import { cn } from "@/lib/utils";
import {
    MAX_DISPLAY_SECONDS,
    MAX_SIZE_PERCENT,
    MEDIA_TYPE_HINTS,
    MEDIA_TYPE_LABELS,
    MIN_DISPLAY_SECONDS,
    MIN_SIZE_PERCENT,
} from "../constants";
import { toUploadedFile, pickedFromUpload, useReactionForm, type SaveReaction } from "../hooks/useReactionForm";
import type { EditingReaction } from "../hooks/useReactiveReward";
import type { Reaction, ReactionMediaType } from "../types";
import { MediaFilePicker } from "./MediaFilePicker";
import { PositionGrid } from "./PositionGrid";

interface ReactionSheetProps {
    editing: EditingReaction;
    rewards: SelectableReward[];
    isRewardsLoading: boolean;
    /** Whether another reaction already uses this reward. */
    rewardUsedBy: (rewardId: string, exceptReactionId?: string) => boolean;
    onSave: SaveReaction;
    onDelete: (reactionId: string) => Promise<boolean>;
    onTest: (reactionId: string) => void;
    isTesting: boolean;
    onClose: () => void;
}

/** Remounts per reaction so the form always starts from the one being edited. */
export function ReactionSheet(props: ReactionSheetProps) {
    const { editing, onClose } = props;
    return (
        <Sheet open={!!editing} onOpenChange={(open) => !open && onClose()}>
            {editing && <ReactionSheetBody key={editing === "new" ? "new" : editing.id} {...props} reaction={editing === "new" ? null : editing} />}
        </Sheet>
    );
}

const MEDIA_TYPES: ReactionMediaType[] = ["IMAGE", "AUDIO", "VIDEO"];
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function SliderField({ value, min, max, unit, onChange, label }: { value: number; min: number; max: number; unit: string; onChange: (value: number) => void; label: string }) {
    return (
        <div className="flex items-center gap-4">
            <Slider aria-label={label} value={[value]} onValueChange={([next]) => onChange(next)} min={min} max={max} className="flex-1" />
            <div className="w-32">
                <InputGroup>
                    <InputGroupInput
                        type="number"
                        aria-label={label}
                        value={value}
                        min={min}
                        max={max}
                        className="font-mono tabular-nums"
                        onChange={(event) => {
                            const parsed = Number(event.target.value);
                            onChange(Number.isFinite(parsed) ? clamp(Math.round(parsed), min, max) : min);
                        }}
                    />
                    <InputGroupAddon align="inline-end">{unit}</InputGroupAddon>
                </InputGroup>
            </div>
        </div>
    );
}

function ReactionSheetBody({
    reaction,
    rewards,
    isRewardsLoading,
    rewardUsedBy,
    onSave,
    onDelete,
    onTest,
    isTesting,
    onClose,
}: ReactionSheetProps & { reaction: Reaction | null }) {
    const form = useReactionForm(reaction, onSave);
    const [confirmDelete, setConfirmDelete] = useState(false);
    // The reward list must render inside the sheet: a modal sheet blocks clicks on anything portaled outside it
    const [sheetElement, setSheetElement] = useState<HTMLElement | null>(null);
    const isNew = reaction === null;
    const showsImage = form.mediaType === "IMAGE";
    const showsVisual = form.mediaType !== "AUDIO";

    const getRewardDisabledNote = (candidate: SelectableReward) =>
        rewardUsedBy(candidate.id, reaction?.id) ? "ใช้กับ Reaction อื่นอยู่แล้ว" : null;

    return (
        <SheetContent ref={setSheetElement} aria-describedby={undefined}>
            <SheetHeader>
                <SheetTitle>{isNew ? "เพิ่ม Reaction" : "แก้ไข Reaction"}</SheetTitle>
                <SheetDescription>เลือกแต้มช่องและสิ่งที่จะเล่นบนหน้าจอเมื่อมีคนแลก</SheetDescription>
            </SheetHeader>

            <div className="grid flex-1 content-start gap-8 overflow-y-auto px-6 py-6">
                <div className="space-y-2">
                    <Label>แต้มช่องบน Twitch</Label>
                    <SubLabel>เลือกแต้มช่องที่ใช้เล่น Reaction นี้ (แต้มช่องหนึ่งใช้ได้กับ Reaction เดียว)</SubLabel>
                    <ChannelRewardSelector
                        value={form.rewardId}
                        onValueChange={form.setRewardId}
                        rewards={rewards}
                        isLoading={isRewardsLoading}
                        allowNone={false}
                        getRewardDisabledNote={getRewardDisabledNote}
                        popupContainer={sheetElement}
                    />
                </div>

                <div className="space-y-2">
                    <Label id="media-type-label">สิ่งที่จะเล่น</Label>
                    <div role="radiogroup" aria-labelledby="media-type-label" className="grid grid-cols-3 gap-2">
                        {MEDIA_TYPES.map((mediaType) => {
                            const selected = form.mediaType === mediaType;
                            return (
                                <button
                                    key={mediaType}
                                    type="button"
                                    role="radio"
                                    aria-checked={selected}
                                    onClick={() => form.setMediaType(mediaType)}
                                    className={cn(
                                        "bg-card hover:bg-secondary cursor-pointer space-y-1 rounded-lg border p-3 text-left",
                                        selected && "border-primary bg-primary/10",
                                    )}
                                >
                                    <span className="block text-sm font-medium">{MEDIA_TYPE_LABELS[mediaType]}</span>
                                    <span className="text-muted-foreground block text-sm">{MEDIA_TYPE_HINTS[mediaType]}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>ไฟล์{MEDIA_TYPE_LABELS[form.mediaType]}</Label>
                    {form.mediaType === "AUDIO" ? (
                        <CompactAudioFileUploader
                            currentFileName={form.media?.name ?? null}
                            selectedFile={form.media ? toUploadedFile(form.media) : null}
                            onFileSelect={(file) => file && !(file instanceof File) && form.setMedia(pickedFromUpload(file))}
                            disabled={form.isSaving}
                        />
                    ) : (
                        <MediaFilePicker
                            key={form.mediaType}
                            kind={showsImage ? "image" : "video"}
                            value={form.media}
                            onChange={form.setMedia}
                            disabled={form.isSaving}
                        />
                    )}
                </div>

                {showsImage && (
                    <div className="space-y-2">
                        <Label>เสียงที่เล่นคู่กับรูป (ไม่บังคับ)</Label>
                        <SubLabel>ถ้าไม่เลือก จะแสดงเฉพาะรูป</SubLabel>
                        <CompactAudioFileUploader
                            currentFileName={form.sound?.name ?? null}
                            selectedFile={form.sound ? toUploadedFile(form.sound) : null}
                            onFileSelect={(file) => file && !(file instanceof File) && form.setSound(pickedFromUpload(file))}
                            onClear={() => form.setSound(null)}
                            disabled={form.isSaving}
                        />
                    </div>
                )}

                {form.hasSound && (
                    <div className="space-y-2">
                        <Label>ระดับเสียง</Label>
                        <SliderField label="ระดับเสียง" value={form.volume} min={0} max={100} unit="%" onChange={form.setVolume} />
                    </div>
                )}

                {showsImage && (
                    <div className="space-y-2">
                        <Label>ระยะเวลาที่แสดงรูป</Label>
                        <SubLabel>
                            รูปจะค้างบนหน้าจอตามเวลานี้{form.sound ? " หรือจนเสียงจบ ถ้าเสียงยาวกว่า" : ""}
                        </SubLabel>
                        <SliderField
                            label="ระยะเวลาที่แสดงรูป"
                            value={Math.round(form.displayMs / 1000)}
                            min={MIN_DISPLAY_SECONDS}
                            max={MAX_DISPLAY_SECONDS}
                            unit="วินาที"
                            onChange={(seconds) => form.setDisplayMs(seconds * 1000)}
                        />
                    </div>
                )}

                {showsVisual && (
                    <div className="grid gap-8 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>ตำแหน่งบนหน้าจอ</Label>
                            <PositionGrid value={form.position} onChange={form.setPosition} disabled={form.isSaving} />
                        </div>
                        <div className="space-y-2">
                            <Label>ขนาด</Label>
                            <SubLabel>เทียบกับความกว้างของหน้าจอ</SubLabel>
                            <SliderField label="ขนาด" value={form.sizePercent} min={MIN_SIZE_PERCENT} max={MAX_SIZE_PERCENT} unit="%" onChange={form.setSizePercent} />
                        </div>
                    </div>
                )}

                <div className="bg-card flex items-center justify-between rounded-lg border p-4">
                    <div className="mr-2 space-y-1">
                        <Label>เปิดใช้งาน Reaction นี้</Label>
                        <SubLabel>ปิดไว้ชั่วคราวได้โดยไม่ต้องลบ</SubLabel>
                    </div>
                    <Switch aria-label="เปิดใช้งาน Reaction นี้" checked={form.enabled} onCheckedChange={form.setEnabled} />
                </div>
            </div>

            <SheetFooter>
                {isNew ? (
                    <span />
                ) : (
                    <Button
                        type="button"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        disabled={form.isSaving}
                        onClick={() => setConfirmDelete(true)}
                    >
                        <Trash2 />
                        ลบ Reaction
                    </Button>
                )}
                <div className="flex flex-wrap gap-2">
                    {!isNew && <TestWidgetButton onTest={() => onTest(reaction.id)} isLoading={isTesting} />}
                    <Button type="button" variant="outline" onClick={onClose}>
                        ยกเลิก
                    </Button>
                    <Button
                        type="button"
                        disabled={!form.canSave}
                        onClick={async () => {
                            if (await form.save()) onClose();
                        }}
                    >
                        {form.isSaving ? "กำลังบันทึก..." : "บันทึก"}
                    </Button>
                </div>
            </SheetFooter>

            <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ลบ Reaction นี้ใช่ไหม</AlertDialogTitle>
                        <AlertDialogDescription>
                            เมื่อลบแล้ว แต้มช่องนี้จะไม่เล่นอะไรบนหน้าจออีก ไฟล์ในคลังของคุณยังอยู่ตามเดิม
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={async () => {
                                if (reaction && (await onDelete(reaction.id))) onClose();
                            }}
                        >
                            <Trash2 />
                            ยืนยันการลบ
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SheetContent>
    );
}
