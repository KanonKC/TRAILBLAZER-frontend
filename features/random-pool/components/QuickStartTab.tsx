"use client";

import GoToSettingsButton from "@/components/widget/GoToSettingsButton";
import WidgetEnabledBadge from "@/components/widget/WidgetEnabledBadge";
import WidgetQuickStartCard from "@/components/widget/widget-tab-card/WidgetQuickStartCard";
import { WidgetTestControl } from "@/components/widget/WidgetTestControl";
import { WidgetStepper } from "@/components/widget/WidgetStepper/WidgetStepper";
import WidgetStepperItems from "@/components/widget/WidgetStepper/WidgetStepperItems/WidgetStepperItems";
import { RandomPoolController } from "../hooks/useRandomPool";
import { PoolItemsEditor } from "./PoolItemsEditor";
import { OverlayUrlField } from "./OverlayUrlField";
import { ChannelRewardSelector } from "@/components/widget/ChannelRewardSelector";
import { Label } from "@/components/ui/label";
import SubLabel from "@/components/SubLabel";

export function QuickStartTab({
  controller,
}: {
  controller: RandomPoolController;
}) {
  const { savedConfig, selectedPool, busy } = controller;

  return (
    <WidgetQuickStartCard>
      <div className="grid gap-6">
        <WidgetStepper>
          <WidgetStepperItems
            items={[
              {
                step: 1,
                title: "เปิดใช้งานวิดเจ็ต",
                description: (
                  <div className="space-y-3">
                    <p className="text-muted-foreground text-sm">
                      เปิดวิดเจ็ตนี้เพื่อให้คนดูแลกแต้มช่องแล้วสุ่มของรางวัลขึ้นหน้าจอสตรีมของคุณ
                    </p>
                    <WidgetEnabledBadge />
                  </div>
                ),
              },
              {
                step: 2,
                title: "เพิ่มรายการในกองสุ่ม",
                description: selectedPool ? (
                  <div className="grid gap-3">
                    <p className="text-muted-foreground text-sm">
                      เพิ่มรายการที่อยากให้คนดูสุ่มได้ลงในกองสุ่มของคุณ
                      แต่ละรายการใส่แค่รูปและชื่อ
                    </p>
                    <PoolItemsEditor controller={controller} simple />
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    ยังไม่มีกองสุ่ม สร้างกองสุ่มได้ที่แท็บตั้งค่า
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
                ),
              },
              {
                step: 4,
                title: "นำ Overlay ไปใส่ใน OBS",
                description: (
                  <OverlayUrlField
                    config={savedConfig}
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
                      กดบันทึก แล้วลองกดปุ่มทดสอบหรือแลกแต้มช่องในช่องของคุณ เพื่อดูผลบนสตรีม
                    </p>
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
              {
                step: 6,
                title: "การตั้งค่าเพิ่มเติม",
                description: (
                  <div className="space-y-3">
                    <p className="text-muted-foreground text-sm">
                      ปรับวิธีสุ่ม Animation ข้อความแชท เสียง และสร้างการตั้งค่าเพิ่มได้ในแท็บตั้งค่า
                    </p>
                    <GoToSettingsButton
                      onClick={() => controller.setActiveTab("settings")}
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
