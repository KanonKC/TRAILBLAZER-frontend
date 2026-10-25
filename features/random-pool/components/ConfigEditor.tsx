"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Boxes,
  Dices,
  MessageSquare,
  Play,
  Settings2,
  Trash2,
  Volume2,
  Zap,
} from "lucide-react";
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
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RandomPoolController } from "../hooks/useRandomPool";
import { useActiveSection } from "../hooks/useActiveSection";
import { ALERT_TONE, POOL_STATE_NOTICE } from "../constants";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import SubLabel from "@/components/SubLabel";
import { ChatMessageField } from "./ChatMessageField";
import { OptionCard } from "./OptionCard";
import { WidgetStatusSwitch } from "@/components/widget/WidgetStatusSwitch";
import { enableBlockedReason } from "../enableBlockedReason";
import { ConfigSwitcher } from "./ConfigSwitcher";
import { DrawSection } from "./DrawSection";
import { OverlayUrlField } from "./OverlayUrlField";
import { PoolItemsEditor } from "./PoolItemsEditor";
import { PoolPicker } from "./PoolPicker";
import { ChannelRewardSelector } from "@/components/widget/ChannelRewardSelector";
import { SectionTitle } from "./SectionTitle";
import { AudioFileUploader } from "@/components/widget/AudioFileUploader/AudioFileUploader";
import type { UploadedFile } from "@/services/uploadedFile.service";

const sections = [
  { id: "sec-general", label: "ทั่วไป" },
  { id: "sec-pool", label: "กองสุ่มและรายการ" },
  { id: "sec-draw", label: "การสุ่ม" },
  { id: "sec-chat", label: "ข้อความแชท" },
  { id: "sec-sound", label: "เสียง" },
];

function Section({
  id,
  first,
  children,
}: {
  id: string;
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "grid scroll-mt-20 gap-6 py-8",
        first ? "pt-2" : "border-t",
      )}
    >
      {children}
    </section>
  );
}

export function ConfigEditor({
  controller,
}: {
  controller: RandomPoolController;
}) {
  const { draft, savedConfig, selectedPool, isNewConfig, busy, quota } =
    controller;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const activeSection = useActiveSection(sections.map((section) => section.id));
  const poolNotice =
    savedConfig && savedConfig.pool_state !== "READY"
      ? POOL_STATE_NOTICE[savedConfig.pool_state]
      : null;
  const blockedReason = enableBlockedReason(savedConfig, controller.quota);

  const soundFile = (key?: string | null) =>
    controller.files.find((file) => file.key === key) ?? null;
  const soundName = (key?: string | null) =>
    soundFile(key)?.name ?? (key ? "ตั้งค่าเสียงแล้ว" : null);
  function pickSound(
    file: File | UploadedFile | null,
    key: string | null,
    field: "spin_sound_key" | "default_result_sound_key",
  ) {
    if (file && !(file instanceof File)) controller.rememberFile(file);
    controller.patchDraft({ [field]: key });
  }
  const pointsNote =
    !savedConfig?.widget.enabled && quota && quota.remaining_quota <= 0
      ? `เปิดใช้งานการตั้งค่านี้ไม่ได้ เพราะ พอยท์วิดเจ็ต ครบ ${quota.used_quota} / ${quota.total_quota} ปิดการตั้งค่าอื่นเพื่อคืนพอยท์`
      : ``;

  return (
    <div className="grid gap-4">
      <button
        type="button"
        onClick={controller.backToList}
        className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft className="size-4" />
        การตั้งค่าทั้งหมด
      </button>

      <div className="relative z-10 grid gap-2">
        <ConfigSwitcher controller={controller} />
        <p className="text-muted-foreground text-sm">{pointsNote}</p>
      </div>

      <nav
        aria-label="สารบัญ"
        className="bg-card sticky top-0 z-10 flex gap-1 overflow-x-auto rounded-lg border p-1.5"
      >
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={activeSection === section.id ? "true" : undefined}
            className={cn(
              "text-muted-foreground hover:text-foreground shrink-0 rounded-md px-3 py-1.5 text-sm font-medium",
              activeSection === section.id && "bg-secondary text-foreground",
            )}
          >
            {section.label}
          </a>
        ))}
      </nav>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <Settings2 className="size-5 text-info" />
              ตั้งค่า
            </span>
            <span className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-supernova/10 px-2 py-0.5 text-sm font-medium text-supernova">
                <Zap className="size-3" />1 พอยท์
              </span>
              {savedConfig && (
                <WidgetStatusSwitch
                  widgetId={savedConfig.widget.id}
                  isEnabled={savedConfig.widget.enabled}
                  disabled={!!blockedReason && !savedConfig.widget.enabled}
                  ariaLabel={`เปิดใช้งาน ${savedConfig.name}`}
                  onSuccess={() => void controller.afterStatusChange()}
                />
              )}
            </span>
          </CardTitle>
          <CardDescription>
            ปรับแต่งการตั้งค่านี้ทั้งหมดในหน้าเดียว ดูตัวอย่างได้ที่แผงตัวอย่าง
            {blockedReason && ` · ${blockedReason}`}
          </CardDescription>
        </CardHeader>

        <div className="grid px-6">
          {poolNotice && (
            <Alert
              className={cn("mb-6", ALERT_TONE[poolNotice.tone].box)}
            >
              {(() => {
                const ToneIcon = ALERT_TONE[poolNotice.tone].Icon;
                return <ToneIcon className={ALERT_TONE[poolNotice.tone].text} />;
              })()}
              <AlertTitle className={ALERT_TONE[poolNotice.tone].text}>
                {poolNotice.title}
              </AlertTitle>
              <AlertDescription className="text-foreground">
                {poolNotice.description}
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href="#sec-pool">เลือกกองสุ่มใหม่</a>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Section id="sec-general" first>
            <SectionTitle icon={Settings2}>ทั่วไป</SectionTitle>
            <div className="space-y-2">
              <Label htmlFor="config-name">ชื่อการตั้งค่า</Label>
              <SubLabel>ตั้งชื่อให้จำง่าย โดยเฉพาะถ้าคุณมีหลายการตั้งค่า</SubLabel>
              <Input
                id="config-name"
                maxLength={100}
                value={draft.name}
                onChange={(event) =>
                  controller.patchDraft({ name: event.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>แต้มช่อง</Label>
              <SubLabel>
                คนดูแลกแต้มช่องนี้เพื่อสุ่ม 1 แต้มช่อง ผูกกับ 1 กองสุ่ม
              </SubLabel>
              <ChannelRewardSelector
                value={controller.draft.twitch_reward_id || null}
                onValueChange={(value) =>
                  controller.patchDraft({ twitch_reward_id: value ?? "" })
                }
                rewards={controller.rewards}
                allowNone={false}
                getRewardDisabledNote={(reward) => controller.rewardUsedNote(reward.id)}
              />
            </div>
            <div className="space-y-2">
              <Label>ลิงก์โอเวอร์เลย์</Label>
              <OverlayUrlField
                config={savedConfig}
                onRefreshed={controller.reload}
                description="แต่ละการตั้งค่ามี URL ของตัวเอง เก็บเป็นความลับเหมือนรหัสผ่าน"
              />
            </div>
          </Section>

          <Section id="sec-pool">
            <SectionTitle icon={Boxes}>กองสุ่มและรายการ</SectionTitle>
            <div
              role="radiogroup"
              aria-label="ที่มาของกองสุ่ม"
              className="grid gap-2"
            >
              <Label>ที่มาของกองสุ่ม</Label>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3">
                <OptionCard
                  icon={Boxes}
                  title="กองสุ่มของตัวเอง"
                  description="แก้ไขรายการและตั้งค่าได้เต็มที่"
                  checked
                />
                <OptionCard
                  icon={Boxes}
                  title="Import กองสุ่มของคนอื่น"
                  description="ใช้กองสุ่มสาธารณะของสตรีมเมอร์คนอื่น"
                  checked={false}
                  disabled
                  badge={<Badge variant="outline">เร็วๆ นี้</Badge>}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>กองสุ่มที่ใช้สุ่ม</Label>
              <SubLabel>
                การแก้รายการที่นี่คือแก้กองสุ่มตัวจริง ข้อมูลชุดเดียวกับทุกการตั้งค่าที่ใช้กองสุ่มนี้
              </SubLabel>
              <PoolPicker controller={controller} />
            </div>
            {selectedPool && <PoolItemsEditor controller={controller} />}
          </Section>

          <Section id="sec-draw">
            <SectionTitle icon={Dices}>การสุ่ม</SectionTitle>
            <DrawSection controller={controller} />
          </Section>

          <Section id="sec-chat">
            <SectionTitle icon={MessageSquare}>ข้อความแชท</SectionTitle>
            <ChatMessageField
              value={draft.default_chat_message ?? ""}
              onChange={(value) =>
                controller.patchDraft({ default_chat_message: value })
              }
            />
            <div className="space-y-2">
              <Label>ข้อความเฉพาะรายการ</Label>
              <SubLabel>
                {`ตั้งในหน้าต่างแก้ไขของแต่ละรายการ ระบบใช้ข้อความของรายการก่อน ถ้าไม่มีจึงใช้ข้อความเริ่มต้นด้านบน ตอนนี้ตั้งแล้ว ${
                  draft.items.filter((setting) => setting.chat_message).length
                } จาก ${controller.poolItems.length} รายการ`}
              </SubLabel>
            </div>
          </Section>

          <Section id="sec-sound">
            <SectionTitle icon={Volume2}>เสียง</SectionTitle>
            <SubLabel>รองรับไฟล์ MP3, WAV, OGG ขนาดไม่เกิน 2.5 MB</SubLabel>
            <div className="space-y-2">
              <Label>เสียงตอนกำลังสุ่ม</Label>
              <SubLabel>เล่นระหว่างที่รูปกำลังหมุนหรือเลื่อน</SubLabel>
              <AudioFileUploader
                hideLabel
                currentFileName={soundName(draft.spin_sound_key)}
                selectedFile={soundFile(draft.spin_sound_key)}
                onFileSelect={(file, key) =>
                  pickSound(file, key, "spin_sound_key")
                }
                onClear={() => controller.patchDraft({ spin_sound_key: null })}
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label>เสียงตอนของออก</Label>
              <SubLabel>
                เล่นตอนผลลัพธ์ปรากฏ รายการที่ไม่ได้ตั้งเสียงเฉพาะจะเล่นเสียงนี้ ตั้งเสียงเฉพาะรายการได้ในหน้าต่างแก้ไขรายการ
              </SubLabel>
              <AudioFileUploader
                hideLabel
                currentFileName={soundName(draft.default_result_sound_key)}
                selectedFile={soundFile(draft.default_result_sound_key)}
                onFileSelect={(file, key) =>
                  pickSound(file, key, "default_result_sound_key")
                }
                onClear={() =>
                  controller.patchDraft({ default_result_sound_key: null })
                }
                disabled={busy}
              />
            </div>
          </Section>
        </div>

        <CardFooter className="flex flex-wrap justify-between gap-3 border-t px-6 py-4">
          <Button
            type="button"
            variant="destructive"
            disabled={busy}
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 />
            {isNewConfig ? "ยกเลิกการสร้าง" : "ลบการตั้งค่า"}
          </Button>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={controller.poolItems.length === 0}
              onClick={controller.requestTestSpin}
            >
              <Play />
              ทดสอบ
            </Button>
            <Button
              type="button"
              disabled={!controller.canSave}
              onClick={() => void controller.saveConfig()}
            >
              {busy ? "กำลังบันทึก…" : "บันทึกการเปลี่ยนแปลง"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isNewConfig
                ? "ยกเลิกการสร้างการตั้งค่านี้ใช่ไหม"
                : `ลบ "${draft.name}" ใช่ไหม`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isNewConfig
                ? "ข้อมูลที่ยังไม่ได้บันทึกจะหายไป"
                : "ลบแล้วกู้คืนไม่ได้ กองสุ่มที่ใช้อยู่จะยังอยู่ ส่วน Overlay URL ของการตั้งค่านี้จะใช้ไม่ได้"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ย้อนกลับ</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => void controller.deleteConfig()}
            >
              {isNewConfig ? "ยกเลิกการสร้าง" : "ลบการตั้งค่า"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
