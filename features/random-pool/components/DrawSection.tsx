"use client";

import {
  GalleryHorizontal,
  Image as ImageIcon,
  LoaderPinwheel,
  Scale,
  Shuffle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { RandomPoolController } from "../hooks/useRandomPool";
import { ALERT_TONE, MAX_WEIGHT, MIN_WEIGHT } from "../constants";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ItemThumb } from "./ItemThumb";
import { RadioGroup } from "@/components/ui/radio-group";
import { OptionCard } from "./OptionCard";
import { Label } from "@/components/ui/label";
import SubLabel from "@/components/SubLabel";

/** Choices sit side by side and wrap to one column when the screen is narrow. */
const OPTION_COLUMNS =
  "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3";

export function DrawSection({
  controller,
}: {
  controller: RandomPoolController;
}) {
  const { draft, poolItems } = controller;
  const weighted = draft.mode === "WEIGHTED";
  const totalWeight = poolItems.reduce(
    (sum, item) => sum + controller.weightOf(item.id),
    0,
  );

  return (
    <>
      <div className="space-y-2">
        <Label>โหมดการสุ่ม</Label>
        <SubLabel>
          เลือกว่าทุกรายการมีโอกาสออกเท่ากัน หรือให้บางรายการออกง่ายหรือยากกว่า
        </SubLabel>
        <RadioGroup
          value={draft.mode}
          onValueChange={(mode) =>
            controller.changeMode(mode as "UNIFORM" | "WEIGHTED")
          }
          aria-label="โหมดการสุ่ม"
          className={OPTION_COLUMNS}
        >
          <OptionCard
            id="draw-mode-uniform"
            value="UNIFORM"
            icon={Shuffle}
            title="สุ่มเท่ากัน"
            description="ทุกรายการมีโอกาสออกเท่ากัน"
            checked={!weighted}
          />
          <OptionCard
            id="draw-mode-weighted"
            value="WEIGHTED"
            icon={Scale}
            title="ถ่วงน้ำหนัก"
            description="ตั้งน้ำหนักให้ของหายากออกยากขึ้น"
            checked={weighted}
          />
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>รูปแบบ Animation</Label>
        <SubLabel>
          {weighted
            ? "โหมดถ่วงน้ำหนักใช้ได้เฉพาะ Spin Wheel เพราะขนาดช่องบนวงล้อเป็นไปตามน้ำหนักจริง"
            : "โหมดสุ่มเท่ากันใช้ Image Shuffle หรือ Slide ได้ ส่วน Spin Wheel ใช้ได้เฉพาะโหมดถ่วงน้ำหนัก"}
        </SubLabel>
        <RadioGroup
          value={draft.visualization}
          onValueChange={(visualization) =>
            controller.patchDraft({
              visualization: visualization as "SHUFFLE" | "SLIDE" | "WHEEL",
            })
          }
          aria-label="รูปแบบ Animation"
          className={OPTION_COLUMNS}
        >
          <OptionCard
            id="draw-animation-shuffle"
            value="SHUFFLE"
            icon={ImageIcon}
            title="Image Shuffle"
            description="รูปสลับไปเรื่อยๆ แล้วค่อยๆ ช้าลงจนหยุด"
            checked={draft.visualization === "SHUFFLE"}
            disabled={weighted}
          />
          <OptionCard
            id="draw-animation-slide"
            value="SLIDE"
            icon={GalleryHorizontal}
            title="Slide"
            description="แถบเลื่อนแนวนอนแบบสุ่มปืน"
            checked={draft.visualization === "SLIDE"}
            disabled={weighted}
          />
          <OptionCard
            id="draw-animation-wheel"
            value="WHEEL"
            icon={LoaderPinwheel}
            title="Spin Wheel"
            description="วงล้อ ช่องใหญ่เล็กตามน้ำหนัก"
            checked={draft.visualization === "WHEEL"}
            disabled={!weighted}
          />
        </RadioGroup>
      </div>

      {weighted && (
        <div className="space-y-2">
          <Label>น้ำหนักของแต่ละรายการ</Label>
          <SubLabel>
            รายการที่ได้น้ำหนักมากออกบ่อยกว่า
            โอกาสออกคำนวณจากน้ำหนักของรายการหารด้วยน้ำหนักรวม รายการใหม่เริ่มที่
            1
          </SubLabel>
          {poolItems.length === 0 ? (
            <Alert className={ALERT_TONE.warning.box}>
              <ALERT_TONE.warning.Icon className={ALERT_TONE.warning.text} />
              <AlertTitle className={ALERT_TONE.warning.text}>
                ยังไม่มีรายการ
              </AlertTitle>
              <AlertDescription className="text-foreground">
                เพิ่มรายการในกองสุ่มก่อนถึงจะตั้งน้ำหนักได้
              </AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <div className="bg-card text-muted-foreground grid grid-cols-[40px_minmax(0,1fr)_96px_72px] items-center gap-3 border-b px-3 py-2 text-sm font-medium">
                <span />
                <span>รายการ</span>
                <span className="text-right">น้ำหนัก</span>
                <span className="text-right">โอกาสออก</span>
              </div>
              {poolItems.map((item) => {
                const weight = controller.weightOf(item.id);
                const label = item.name || "รายการที่ไม่มีชื่อ";
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-[40px_minmax(0,1fr)_96px_72px] items-center gap-3 border-b px-3 py-2 last:border-b-0"
                  >
                    <ItemThumb
                      url={item.image_url}
                      alt={label}
                      className="size-10"
                    />
                    <span className="truncate text-sm">{label}</span>
                    <Input
                      type="number"
                      min={MIN_WEIGHT}
                      max={MAX_WEIGHT}
                      step="any"
                      aria-label={`น้ำหนักของ ${label}`}
                      className="text-right font-mono"
                      value={weight}
                      onChange={(event) =>
                        item.id &&
                        controller.setItemWeight(
                          item.id,
                          Number(event.target.value),
                        )
                      }
                    />
                    <span className="text-muted-foreground text-right font-mono text-sm tabular-nums">
                      {totalWeight > 0
                        ? `${((weight / totalWeight) * 100).toFixed(1)}%`
                        : "0.0%"}
                    </span>
                  </div>
                );
              })}
              <div className="bg-card flex items-center justify-between gap-3 border-t px-3 py-3 text-sm font-medium">
                <span>น้ำหนักรวม</span>
                <span className="font-mono">{+totalWeight.toFixed(3)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
