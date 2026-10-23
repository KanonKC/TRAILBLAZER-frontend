"use client";

import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WidgetConfigLayout } from "@/components/widget/layout/WidgetConfigLayout";
import { WidgetQuotaDialog } from "@/components/widget/WidgetQuotaDialog";
import { WidgetTypeMeta } from "@/services/widget.service";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  RandomPoolStartOptions,
  RandomPoolTab,
  useRandomPool,
} from "../hooks/useRandomPool";
import { InitialData } from "../types";
import { OverviewTab } from "./OverviewTab";
import { PreviewPanel } from "./PreviewPanel";
import { QuickStartTab } from "./QuickStartTab";
import { SettingsTab } from "./SettingsTab";

export function RandomPoolWidget({
  initial,
  widgetType,
  start,
}: {
  initial: InitialData | null;
  widgetType: WidgetTypeMeta;
  start?: RandomPoolStartOptions;
}) {
  const base = useRandomPool(initial, start);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [spinOnOpen, setSpinOnOpen] = useState(false);
  const showAside =
    base.activeTab === "settings" && base.settingsView === "edit";
  // The side panel is hidden below lg and absent outside the editor, so the
  // test spin runs in the bottom sheet there.
  const controller = {
    ...base,
    requestTestSpin: () => {
      base.requestTestSpin();
      if (!showAside || !window.matchMedia("(min-width: 1024px)").matches) {
        setSpinOnOpen(true);
        setPreviewOpen(true);
      }
    },
  };
  const showPreview =
    controller.activeTab === "settings" && controller.settingsView === "edit";

  return (
    <WidgetConfigLayout
      widgetType={widgetType}
      wide={showPreview}
      quotaRefreshKey={controller.quotaVersion}
    >
      {() => (
        <div className="flex items-start gap-6">
          <div className="w-full max-w-2xl min-w-0 flex-1">
            <Tabs
              value={controller.activeTab}
              onValueChange={(value) =>
                controller.setActiveTab(value as RandomPoolTab)
              }
              className="w-full"
            >
              <TabsList
                className={cn(
                  "mb-4 grid w-full",
                  controller.isLoggedIn ? "grid-cols-3" : "grid-cols-1",
                )}
              >
                <TabsTrigger value="overview" className="cursor-pointer">
                  ภาพรวม
                </TabsTrigger>
                {controller.isLoggedIn && (
                  <>
                    <TabsTrigger value="quick-start" className="cursor-pointer">
                      เริ่มต้นใช้งาน
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="cursor-pointer">
                      ตั้งค่า
                    </TabsTrigger>
                  </>
                )}
              </TabsList>

              <TabsContent value="overview">
                <OverviewTab isLoggedIn={controller.isLoggedIn} />
              </TabsContent>
              {controller.isLoggedIn && (
                <>
                  <TabsContent value="quick-start">
                    <QuickStartTab controller={controller} />
                  </TabsContent>
                  <TabsContent value="settings">
                    <SettingsTab controller={controller} />
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>

          {showPreview && (
            <aside
              aria-label="ตัวอย่าง"
              className="sticky top-4 hidden w-80 shrink-0 lg:block"
            >
              <PreviewPanel controller={controller} />
            </aside>
          )}

          {showPreview && (
            <Button
              type="button"
              variant="outline"
              className="fixed right-4 bottom-4 z-20 shadow-lg lg:hidden"
              onClick={() => {
                setSpinOnOpen(false);
                setPreviewOpen(true);
              }}
            >
              <Eye />
              ตัวอย่าง
            </Button>
          )}
          <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
            <SheetContent side="bottom" aria-describedby={undefined}>
              <SheetHeader className="sr-only">
                <SheetTitle>ตัวอย่าง</SheetTitle>
              </SheetHeader>
              <div className="p-4">
                <PreviewPanel
                  controller={controller}
                  spinOnMount={spinOnOpen}
                />
              </div>
            </SheetContent>
          </Sheet>

          <WidgetQuotaDialog
            open={controller.limitDialog.open}
            onOpenChange={(open) =>
              controller.setLimitDialog((previous) => ({ ...previous, open }))
            }
            enabledWidgets={controller.limitDialog.widgets}
            onDisableWidget={controller.disableOtherWidget}
          />
        </div>
      )}
    </WidgetConfigLayout>
  );
}
