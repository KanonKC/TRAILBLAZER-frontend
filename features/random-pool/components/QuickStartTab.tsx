"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WidgetQuickStartCard from "@/components/widget/widget-tab-card/WidgetQuickStartCard";
import { OBSSetupHelp } from "@/components/widget/OBSSetupHelp";
import { SmartOverlayUrlInput } from "@/components/widget/SmartOverlayUrlInput";
import { overlayPath } from "../api/randomPool.api";
import { WidgetStepper } from "@/components/widget/WidgetStepper/WidgetStepper";
import WidgetStepperItems from "@/components/widget/WidgetStepper/WidgetStepperItems/WidgetStepperItems";
import { RandomPoolController } from "../hooks/useRandomPool";
import { neutralFocus } from "../constants";
import { ConfigSwitcher } from "./ConfigSwitcher";
import { PoolCreateForm } from "./PoolCreateForm";
import { PoolItemsEditor } from "./PoolItemsEditor";
import { RewardSelect } from "./RewardSelect";
import { Field } from "./SectionTitle";

export function QuickStartTab({
  controller,
}: {
  controller: RandomPoolController;
}) {
  const { draft, savedConfig, selectedPool, data, busy } = controller;
  const pools = data.pools.data;

  return (
    <WidgetQuickStartCard>
      <div className="grid gap-6">
        <WidgetStepper>
          <WidgetStepperItems
            items={[
              {
                step: 1,
                title: "สร้างกองสุ่ม",
                description: (
                  <div className="grid gap-3">
                    <p className="text-muted-foreground text-sm">
                      ตั้งชื่อและสร้างกองสุ่มของคุณ จากนั้นเพิ่มรายการที่อยากให้คนดูสุ่มได้ในขั้นตอนถัดไป
                    </p>
                    <PoolCreateForm
                      busy={busy}
                      upload={controller.upload}
                      withCover={false}
                      submitLabel="สร้างกองสุ่ม"
                      usageLabel={`สร้างแล้ว ${pools.length} จาก ${data.pools.limit} กองสุ่ม`}
                      onCreate={controller.createPool}
                    />
                  </div>
                ),
              },
              {
                step: 2,
                title: "ตั้งค่ากองสุ่ม",
                description: selectedPool ? (
                  <div className="grid gap-3">
                    <p className="text-muted-foreground text-sm">
                      เพิ่มรายการลงในกองสุ่มที่สร้างไว้ด้านบน
                      แต่ละรายการใส่แค่รูปและชื่อ
                    </p>
                    <PoolItemsEditor
                      controller={controller}
                      columns="five"
                      simple
                    />
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    สร้างกองสุ่มในขั้นตอนที่ 1 ก่อน แล้วกลับมาเพิ่มรายการที่นี่
                  </p>
                ),
              },
              {
                step: 3,
                title: "เลือกแต้มช่องที่คนดูจะแลก",
                description: (
                  <Field
                    label="แต้มช่อง"
                    help="เลือกแต้มช่องที่มีอยู่ในช่องของคุณ คนดูแลกแต้มช่องนี้เพื่อสุ่ม"
                  >
                    <RewardSelect controller={controller} />
                  </Field>
                ),
              },
              {
                step: 4,
                title: "นำ Overlay ไปใส่ใน OBS",
                description: (
                  savedConfig ? (
                    <div className="grid gap-2">
                      <SmartOverlayUrlInput
                        url={`${window.location.origin}${overlayPath(savedConfig)}`}
                        slug={`random-pool/configs/${savedConfig.id}`}
                        onSuccess={() => void controller.reload()}
                        hideLabel
                      />
                      <p className="text-muted-foreground text-sm">
                        URL นี้เหมือนรหัสผ่านสตรีมของคุณ เก็บเป็นความลับ
                      </p>
                      <OBSSetupHelp className="mt-0" />
                      <p className="text-muted-foreground text-sm">
                        ขนาดแนะนำ 800 × 600 · พื้นหลังโปร่งใส
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      บันทึกการตั้งค่าก่อน แล้ว Overlay URL ของการตั้งค่านี้จะแสดงที่นี่
                    </p>
                  )
                ),
              },
              {
                step: 5,
                title: "บันทึกและทดสอบ",
                description: (
                  <div className="grid gap-3">
                    <p className="text-muted-foreground text-sm">
                      {savedConfig
                        ? "กดบันทึกก่อน แล้วลองแลกแต้มช่องในช่องของคุณเพื่อดูผลบนสตรีม"
                        : "ตั้งชื่อ แล้วกดบันทึกเพื่อสร้างการตั้งค่าและรับ Overlay URL"}
                    </p>
                    {!savedConfig && (
                      <Field label="ชื่อการตั้งค่า" htmlFor="quick-config-name">
                        <Input
                          id="quick-config-name"
                          className={neutralFocus}
                          maxLength={100}
                          value={draft.name}
                          onChange={(event) =>
                            controller.patchDraft({ name: event.target.value })
                          }
                        />
                      </Field>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        disabled={!controller.canSave}
                        onClick={() => void controller.saveConfig()}
                      >
                        {busy ? "กำลังบันทึก…" : "บันทึกการเปลี่ยนแปลง"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={controller.poolItems.length === 0}
                        onClick={controller.requestTestSpin}
                      >
                        <Play />
                        ทดสอบ
                      </Button>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </WidgetStepper>
      </div>
    </WidgetQuickStartCard>
  );
}
