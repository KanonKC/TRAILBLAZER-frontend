"use client";

import { Input } from "@/components/ui/input";
import WidgetQuickStartCard from "@/components/widget/widget-tab-card/WidgetQuickStartCard";
import { WidgetTestControl } from "@/components/widget/WidgetTestControl";
import { WidgetStepper } from "@/components/widget/WidgetStepper/WidgetStepper";
import WidgetStepperItems from "@/components/widget/WidgetStepper/WidgetStepperItems/WidgetStepperItems";
import { RandomPoolController } from "../hooks/useRandomPool";
import { ConfigSwitcher } from "./ConfigSwitcher";
import { PoolCreateForm } from "./PoolCreateForm";
import { PoolItemsEditor } from "./PoolItemsEditor";
import { OverlayUrlField } from "./OverlayUrlField";
import { RewardSelect } from "./RewardSelect";
import { Label } from "@/components/ui/label";
import SubLabel from "@/components/SubLabel";

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
                  <div className="space-y-2">
                    <Label>แต้มช่อง</Label>
                    <SubLabel>
                      เลือกแต้มช่องที่มีอยู่ในช่องของคุณ คนดูแลกแต้มช่องนี้เพื่อสุ่ม
                    </SubLabel>
                    <RewardSelect controller={controller} />
                  </div>
                ),
              },
              {
                step: 4,
                title: "นำ Overlay ไปใส่ใน OBS",
                description: (
                  <OverlayUrlField
                    config={savedConfig}
                    description="URL นี้เหมือนรหัสผ่านสตรีมของคุณ เก็บเป็นความลับ"
                    onRefreshed={controller.reload}
                  />
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
                      <div className="space-y-2">
                        <Label htmlFor="quick-config-name">ชื่อการตั้งค่า</Label>
                        <Input
                          id="quick-config-name"
                          maxLength={100}
                          value={draft.name}
                          onChange={(event) =>
                            controller.patchDraft({ name: event.target.value })
                          }
                        />
                      </div>
                    )}
                    <WidgetTestControl
                      isSaving={busy}
                      isTesting={false}
                      onSave={() => void controller.saveConfig()}
                      onTest={controller.requestTestSpin}
                      canTest={controller.poolItems.length > 0}
                      canSave={controller.canSave}
                    />
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
