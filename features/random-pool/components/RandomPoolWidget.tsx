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
  // The side panel is hidden below lg and absent outside the editor, so the
  // test spin runs in the bottom sheet there.
  const controller = {
    ...base,
  };
  const showPreview = controller.activeTab === "settings";

  return (
    <WidgetConfigLayout
      widgetType={widgetType}
      quotaRefreshKey={controller.quotaVersion}
      aside={
        showPreview ? (
          <aside aria-label="ตัวอย่าง">
            <PreviewPanel controller={controller} />
          </aside>
        ) : undefined
      }
    >
      {() => (
        <div>
          <div className="w-full min-w-0">
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
                  controller.hasConfig ? "grid-cols-3" : "grid-cols-1",
                )}
              >
                <TabsTrigger value="overview" className="cursor-pointer">
                  ภาพรวม
                </TabsTrigger>
                {controller.hasConfig && (
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
                <OverviewTab controller={controller} />
              </TabsContent>
              {controller.hasConfig && (
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

        </div>
      )}
    </WidgetConfigLayout>
  );
}
