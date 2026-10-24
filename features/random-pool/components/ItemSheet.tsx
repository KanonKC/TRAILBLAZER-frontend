"use client";

import { useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UploadedFile } from "@/services/uploadedFile.service";
import { ItemSetting, PoolItem } from "../types";
import { ReplyMessageTextarea } from "@/components/widget/ReplyMessageTextarea";
import { UploadHandler } from "../hooks/useRandomPool";
import {
  CHAT_VARIABLES,
  MAX_CHAT_MESSAGE_LENGTH,
  MAX_ITEM_NAME_LENGTH,
  MIN_WEIGHT,
  neutralFocus,
} from "../constants";
import { Field } from "./SectionTitle";
import { ItemThumb } from "./ItemThumb";
import { SoundField } from "./SoundField";

export interface EditingItem {
  /** `null` while adding a new item to the pool. */
  index: number | null;
  item: PoolItem;
  setting?: ItemSetting;
}

interface Props {
  editing: EditingItem | null;
  /** Image and name only; existing weight, chat message and sound are kept as they are. */
  simple?: boolean;
  weighted: boolean;
  totalWeight: number;
  files: UploadedFile[];
  busy: boolean;
  upload: UploadHandler;
  onClose: () => void;
  onSave: (
    index: number | null,
    item: PoolItem,
    setting: Partial<Omit<ItemSetting, "item_id">>,
  ) => Promise<boolean>;
  onDelete: (item: PoolItem) => Promise<boolean>;
}

/** Remount per item so the form state always starts from the item being edited. */
const chatVariables = CHAT_VARIABLES.map((variable) => ({
  variable: variable.token,
  title: variable.title,
  description: variable.description,
}));

export function ItemSheet(props: Props) {
  const { editing, onClose } = props;
  return (
    <Sheet open={!!editing} onOpenChange={(open) => !open && onClose()}>
      {editing && (
        <ItemSheetBody
          key={editing.item.id ?? `new-${editing.index}`}
          {...props}
          editing={editing}
        />
      )}
    </Sheet>
  );
}

function ItemSheetBody({
  editing,
  simple = false,
  weighted,
  totalWeight,
  files,
  busy,
  upload,
  onClose,
  onSave,
  onDelete,
}: Props & { editing: EditingItem }) {
  const isNew = editing.index === null;
  const [item, setItem] = useState<PoolItem>(editing.item);
  const [weight, setWeight] = useState(editing.setting?.weight ?? 1);
  const [chatMessage, setChatMessage] = useState(
    editing.setting?.chat_message ?? "",
  );
  const [soundKey, setSoundKey] = useState<string | null>(
    editing.setting?.result_sound_key ?? null,
  );
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [imageError, setImageError] = useState("");

  const nameLength = item.name?.length ?? 0;
  const canSave =
    !busy &&
    nameLength <= MAX_ITEM_NAME_LENGTH &&
    Boolean(item.name?.trim() || item.image_key);
  const chance =
    weighted && totalWeight > 0
      ? `${((weight / (totalWeight - (editing.setting?.weight ?? 0) + weight)) * 100).toFixed(1)}%`
      : null;

  function chooseImage(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      setImageError(
        `รูปใหญ่เกิน 2 MB (${(file.size / 1024 / 1024).toFixed(1)} MB) ลองย่อรูปแล้วเลือกใหม่`,
      );
      return;
    }
    setImageError("");
    void upload(file, "image", (key, url) =>
      setItem((previous) => ({ ...previous, image_key: key, image_url: url })),
    );
  }

  async function save() {
    const saved = await onSave(editing.index, item, {
      weight,
      chat_message: chatMessage.trim() ? chatMessage : null,
      result_sound_key: soundKey,
    });
    if (saved) onClose();
  }

  return (
    <SheetContent aria-describedby={undefined}>
      <SheetHeader>
        <SheetTitle>{isNew ? "เพิ่มรายการ" : "แก้ไขรายการ"}</SheetTitle>
        <SheetDescription>
          ตั้งค่าเฉพาะรายการนี้ แก้ที่นี่คือแก้ในกองสุ่มตัวจริง
        </SheetDescription>
      </SheetHeader>

      <div className="grid flex-1 content-start gap-6 overflow-y-auto px-6 py-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <ItemThumb
              url={item.image_url}
              alt={item.name || "รูปรายการ"}
              className="size-20 shrink-0"
              iconClassName="size-6"
            />
            <div className="grid gap-1">
              <label className="border-input hover:bg-muted inline-flex h-8 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm font-medium">
                <Upload className="size-4" />
                {item.image_key ? "เปลี่ยนรูป" : "เลือกรูป"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp,image/avif"
                  className="sr-only"
                  disabled={busy}
                  onChange={(event) => {
                    const selected = event.target.files?.[0];
                    event.target.value = "";
                    if (selected) chooseImage(selected);
                  }}
                />
              </label>
              <span className="text-muted-foreground text-sm">
                png, jpg, webp ไม่เกิน 2 MB
              </span>
              {item.image_key && (
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground w-fit text-sm underline"
                  onClick={() =>
                    setItem((previous) => ({
                      ...previous,
                      image_key: null,
                      image_url: null,
                    }))
                  }
                >
                  ลบรูป
                </button>
              )}
            </div>
          </div>
          {imageError && (
            <p role="alert" className="text-sm text-destructive">
              {imageError}
            </p>
          )}
          <Field
            label="ชื่อรายการ"
            htmlFor="item-name"
            aside={
              <span
                className={
                  nameLength > MAX_ITEM_NAME_LENGTH
                    ? "text-sm text-destructive"
                    : "text-muted-foreground text-sm"
                }
              >
                {nameLength}/{MAX_ITEM_NAME_LENGTH}
              </span>
            }
          >
            <Input
              id="item-name"
              className={neutralFocus}
              value={item.name ?? ""}
              aria-invalid={nameLength > MAX_ITEM_NAME_LENGTH}
              onChange={(event) =>
                setItem((previous) => ({
                  ...previous,
                  name: event.target.value,
                }))
              }
            />
            {nameLength > MAX_ITEM_NAME_LENGTH && (
              <p className="text-sm text-destructive">ชื่อยาวเกิน 32 ตัวอักษร</p>
            )}
            <p className="text-muted-foreground text-sm">
              ใส่รูปหรือชื่ออย่างน้อยหนึ่งอย่าง
            </p>
          </Field>
        </div>

        {!simple && weighted && (
          <div className="grid gap-2 border-t pt-6">
            <label htmlFor="item-weight" className="text-sm font-medium">
              น้ำหนัก
            </label>
            <div className="flex items-center justify-between gap-3">
              <Input
                id="item-weight"
                type="number"
                min={MIN_WEIGHT}
                step="any"
                className={`${neutralFocus} w-28 text-right font-mono`}
                value={weight}
                onChange={(event) =>
                  setWeight(Math.max(MIN_WEIGHT, Number(event.target.value)))
                }
              />
              {chance && (
                <span className="text-muted-foreground font-mono text-sm">
                  โอกาสออก {chance}
                </span>
              )}
            </div>
          </div>
        )}

        {!simple && (
          <div className="grid gap-2 border-t pt-6">
            <Field
              label="ข้อความแชทเฉพาะรายการ"
              htmlFor="item-chat"
              aside={
                <span className="text-muted-foreground text-sm">
                  {chatMessage.length}/{MAX_CHAT_MESSAGE_LENGTH}
                </span>
              }
            >
              <ReplyMessageTextarea
                placeholder="ว่างไว้เพื่อใช้ข้อความเริ่มต้น"
                value={chatMessage}
                onChange={setChatMessage}
                variables={chatVariables}
                error={
                  chatMessage.length > MAX_CHAT_MESSAGE_LENGTH
                    ? `ข้อความต้องไม่เกิน ${MAX_CHAT_MESSAGE_LENGTH} ตัวอักษร`
                    : null
                }
              />
            </Field>
          </div>
        )}

        {!simple && (
          <div className="border-t pt-6">
            <SoundField
              label="เสียงตอนของออก (เฉพาะรายการ)"
              help="ถ้าไม่ตั้ง ระบบใช้เสียงตอนของออกจากส่วนเสียงหลัก mp3, ogg, wav ไม่เกิน 2 MB ยาวไม่เกิน 15 วินาที"
              value={soundKey}
              files={files}
              busy={busy}
              upload={upload}
              onChange={setSoundKey}
            />
          </div>
        )}
      </div>

      <SheetFooter>
        {isNew ? (
          <span />
        ) : (
          <Button
            type="button"
            variant="ghost"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            disabled={busy}
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 />
            ลบรายการ
          </Button>
        )}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button type="button" disabled={!canSave} onClick={() => void save()}>
            {busy ? "กำลังบันทึก…" : "บันทึกรายการ"}
          </Button>
        </div>
      </SheetFooter>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ลบรายการนี้ใช่ไหม</AlertDialogTitle>
            <AlertDialogDescription>
              รายการและรูปจะถูกลบออกจากกองสุ่มตัวจริง
              ทุกการตั้งค่าที่ใช้กองสุ่มนี้จะได้รับผลด้วย
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (await onDelete(editing.item)) onClose();
              }}
            >
              ลบรายการ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SheetContent>
  );
}
